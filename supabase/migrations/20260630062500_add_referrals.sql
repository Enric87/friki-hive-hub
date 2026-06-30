-- Referral program: users invite friends and earn points when the store qualifies the referral.
CREATE OR REPLACE FUNCTION public.generate_referral_code()
RETURNS TEXT
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  new_code TEXT;
BEGIN
  LOOP
    new_code := 'FQ-' || upper(substr(md5(random()::text || clock_timestamp()::text), 1, 6));
    EXIT WHEN NOT EXISTS (
      SELECT 1 FROM public.profiles WHERE referral_code = new_code
    );
  END LOOP;

  RETURN new_code;
END;
$$;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS referral_code TEXT;

UPDATE public.profiles
SET referral_code = public.generate_referral_code()
WHERE referral_code IS NULL;

ALTER TABLE public.profiles
  ALTER COLUMN referral_code SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS profiles_referral_code_key
  ON public.profiles (referral_code);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, referral_code)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email),
    public.generate_referral_code()
  );
  RETURN NEW;
END;
$$;

CREATE TABLE IF NOT EXISTS public.referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inviter_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  invited_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referral_code TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  reward_points INTEGER NOT NULL DEFAULT 50,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  qualified_at TIMESTAMPTZ,
  UNIQUE (invited_user_id)
);

ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own referrals"
  ON public.referrals FOR SELECT TO authenticated
  USING (auth.uid() = inviter_user_id OR auth.uid() = invited_user_id);

CREATE POLICY "Users can claim referrals for themselves"
  ON public.referrals FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = invited_user_id);

CREATE POLICY "Admins can view all referrals"
  ON public.referrals FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update referrals"
  ON public.referrals FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.ensure_my_referral_code()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_code TEXT;
BEGIN
  v_user_id := auth.uid();

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'No autenticado';
  END IF;

  SELECT referral_code INTO v_code
  FROM public.profiles
  WHERE user_id = v_user_id;

  IF v_code IS NULL THEN
    v_code := public.generate_referral_code();
    UPDATE public.profiles
    SET referral_code = v_code
    WHERE user_id = v_user_id;
  END IF;

  RETURN v_code;
END;
$$;

CREATE OR REPLACE FUNCTION public.claim_referral_code(p_code TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_invited_user_id UUID;
  v_inviter_user_id UUID;
  v_code TEXT;
BEGIN
  v_invited_user_id := auth.uid();

  IF v_invited_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'No autenticado');
  END IF;

  v_code := upper(trim(p_code));

  SELECT user_id INTO v_inviter_user_id
  FROM public.profiles
  WHERE referral_code = v_code;

  IF v_inviter_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Código no encontrado');
  END IF;

  IF v_inviter_user_id = v_invited_user_id THEN
    RETURN json_build_object('success', false, 'error', 'No puedes usar tu propio código');
  END IF;

  IF EXISTS (SELECT 1 FROM public.referrals WHERE invited_user_id = v_invited_user_id) THEN
    RETURN json_build_object('success', false, 'error', 'Ya has usado un código de referido');
  END IF;

  INSERT INTO public.referrals (inviter_user_id, invited_user_id, referral_code)
  VALUES (v_inviter_user_id, v_invited_user_id, v_code);

  RETURN json_build_object('success', true, 'reward_points', 50);
END;
$$;

CREATE OR REPLACE FUNCTION public.qualify_referral(p_referral_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_referral public.referrals%ROWTYPE;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RETURN json_build_object('success', false, 'error', 'No autorizado');
  END IF;

  SELECT * INTO v_referral
  FROM public.referrals
  WHERE id = p_referral_id
  FOR UPDATE;

  IF v_referral.id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Referido no encontrado');
  END IF;

  IF v_referral.status = 'qualified' THEN
    RETURN json_build_object('success', true, 'already_qualified', true);
  END IF;

  UPDATE public.referrals
  SET status = 'qualified', qualified_at = now()
  WHERE id = p_referral_id;

  UPDATE public.profiles
  SET points = points + v_referral.reward_points
  WHERE user_id = v_referral.inviter_user_id;

  INSERT INTO public.points_ledger (user_id, delta, type, ref_id, note)
  VALUES (
    v_referral.inviter_user_id,
    v_referral.reward_points,
    'referral_qualified',
    p_referral_id,
    'Referido validado'
  );

  RETURN json_build_object('success', true, 'reward_points', v_referral.reward_points);
END;
$$;
