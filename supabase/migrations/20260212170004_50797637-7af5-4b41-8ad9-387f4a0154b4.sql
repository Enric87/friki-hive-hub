
-- 1. App role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- 2. User roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 3. Security definer function for role checks
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS for user_roles: users can read their own roles, admins can manage all
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 4. Rewards catalog
CREATE TABLE public.rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  points_cost INTEGER NOT NULL,
  image_url TEXT,
  reward_type TEXT NOT NULL DEFAULT 'discount',
  stock INTEGER,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active rewards"
  ON public.rewards FOR SELECT
  USING (active = true);

CREATE POLICY "Admins can manage rewards"
  ON public.rewards FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_rewards_updated_at
  BEFORE UPDATE ON public.rewards
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 5. Reward redemptions
CREATE TABLE public.reward_redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  reward_id UUID REFERENCES public.rewards(id) ON DELETE CASCADE NOT NULL,
  coupon_code TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'disponible',
  redeemed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ,
  used_at TIMESTAMPTZ
);
ALTER TABLE public.reward_redemptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own redemptions"
  ON public.reward_redemptions FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own redemptions"
  ON public.reward_redemptions FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all redemptions"
  ON public.reward_redemptions FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update redemptions"
  ON public.reward_redemptions FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 6. Store config (singleton)
CREATE TABLE public.store_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_name TEXT NOT NULL DEFAULT 'FrikiQuest',
  logo_url TEXT,
  primary_color TEXT DEFAULT '#6d28d9',
  secondary_color TEXT DEFAULT '#f97316',
  address TEXT,
  schedule TEXT,
  phone TEXT,
  whatsapp_url TEXT,
  social_links JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.store_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read store config"
  ON public.store_config FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage store config"
  ON public.store_config FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_store_config_updated_at
  BEFORE UPDATE ON public.store_config
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default store config
INSERT INTO public.store_config (store_name, address, schedule, phone)
VALUES ('FrikiQuest', 'Calle Ejemplo 42, Madrid', 'L-V: 10:00-20:00 | S: 10:00-14:00', '+34 600 123 456');

-- 7. Levels table
CREATE TABLE public.levels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  min_points INTEGER NOT NULL DEFAULT 0,
  icon TEXT NOT NULL DEFAULT '🎮',
  badge_image_url TEXT,
  benefits TEXT[] DEFAULT '{}',
  sort_order INTEGER NOT NULL DEFAULT 0
);
ALTER TABLE public.levels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view levels"
  ON public.levels FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage levels"
  ON public.levels FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Insert default levels
INSERT INTO public.levels (name, min_points, icon, benefits, sort_order) VALUES
  ('Novato', 0, '🎮', ARRAY['Acceso a sorteos básicos'], 1),
  ('Cazador de Loot', 500, '🎯', ARRAY['5% descuento en eventos', 'Acceso anticipado a reservas'], 2),
  ('Maestro Friki', 1000, '⚔️', ARRAY['10% descuento en eventos', 'Reservas prioritarias', 'Doble puntos en cumpleaños'], 3),
  ('Señor del Multiverso', 2000, '👑', ARRAY['15% descuento en todo', 'Acceso VIP a eventos', 'Regalos exclusivos'], 4),
  ('Mítico', 5000, '🌟', ARRAY['20% descuento en todo', 'Invitaciones exclusivas', 'Recompensas secretas', 'Reconocimiento especial'], 5);

-- 8. Achievements
CREATE TABLE public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT NOT NULL DEFAULT '🏆',
  condition_type TEXT NOT NULL,
  condition_value INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view achievements"
  ON public.achievements FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage achievements"
  ON public.achievements FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Insert default achievements
INSERT INTO public.achievements (name, description, icon, condition_type, condition_value) VALUES
  ('Primer Ticket', 'Envía tu primer ticket de compra', '🎫', 'tickets_sent', 1),
  ('Comprador Frecuente', 'Envía 10 tickets', '🛒', 'tickets_sent', 10),
  ('Primera Reserva', 'Realiza tu primera reserva', '📦', 'reservations_made', 1),
  ('Asistente', 'Asiste a tu primer evento', '🎪', 'events_attended', 1),
  ('Coleccionista', 'Canjea 5 recompensas', '💎', 'rewards_redeemed', 5),
  ('Suertudo', 'Gana un sorteo', '🍀', 'giveaways_won', 1);

-- 9. User achievements
CREATE TABLE public.user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  achievement_id UUID REFERENCES public.achievements(id) ON DELETE CASCADE NOT NULL,
  unlocked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, achievement_id)
);
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own achievements"
  ON public.user_achievements FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage achievements"
  ON public.user_achievements FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 10. Function to update user level based on points
CREATE OR REPLACE FUNCTION public.update_user_level()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_level TEXT;
BEGIN
  SELECT name INTO new_level
  FROM public.levels
  WHERE min_points <= NEW.points
  ORDER BY min_points DESC
  LIMIT 1;

  IF new_level IS NOT NULL AND new_level != NEW.level THEN
    NEW.level = new_level;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profile_level
  BEFORE UPDATE OF points ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_user_level();

-- 11. Function to redeem a reward (atomic: check points, deduct, create redemption)
CREATE OR REPLACE FUNCTION public.redeem_reward(p_reward_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_points INTEGER;
  v_cost INTEGER;
  v_stock INTEGER;
  v_coupon TEXT;
  v_reward_name TEXT;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'No autenticado');
  END IF;

  -- Get reward info
  SELECT name, points_cost, stock INTO v_reward_name, v_cost, v_stock
  FROM public.rewards
  WHERE id = p_reward_id AND active = true;

  IF v_cost IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Recompensa no encontrada');
  END IF;

  IF v_stock IS NOT NULL AND v_stock <= 0 THEN
    RETURN json_build_object('success', false, 'error', 'Sin stock');
  END IF;

  -- Get user points
  SELECT points INTO v_points FROM public.profiles WHERE user_id = v_user_id;

  IF v_points < v_cost THEN
    RETURN json_build_object('success', false, 'error', 'Puntos insuficientes');
  END IF;

  -- Generate coupon code
  v_coupon := 'FQ-' || upper(substr(md5(random()::text), 1, 8));

  -- Deduct points
  UPDATE public.profiles SET points = points - v_cost WHERE user_id = v_user_id;

  -- Decrease stock
  IF v_stock IS NOT NULL THEN
    UPDATE public.rewards SET stock = stock - 1 WHERE id = p_reward_id;
  END IF;

  -- Create redemption
  INSERT INTO public.reward_redemptions (user_id, reward_id, coupon_code, expires_at)
  VALUES (v_user_id, p_reward_id, v_coupon, now() + interval '30 days');

  RETURN json_build_object('success', true, 'coupon_code', v_coupon, 'reward_name', v_reward_name);
END;
$$;
