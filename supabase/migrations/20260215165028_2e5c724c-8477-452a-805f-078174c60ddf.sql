
-- Tickets table
CREATE TABLE public.tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  total_amount NUMERIC(10,2),
  points_awarded INTEGER NOT NULL DEFAULT 0,
  image_url TEXT,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMPTZ
);

ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own tickets"
  ON public.tickets FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own tickets"
  ON public.tickets FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all tickets"
  ON public.tickets FOR SELECT USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all tickets"
  ON public.tickets FOR UPDATE USING (has_role(auth.uid(), 'admin'));

-- Points ledger table
CREATE TABLE public.points_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  delta INTEGER NOT NULL,
  type TEXT NOT NULL DEFAULT 'manual_adjustment',
  ref_id UUID,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.points_ledger ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own ledger"
  ON public.points_ledger FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all ledger"
  ON public.points_ledger FOR SELECT USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert ledger"
  ON public.points_ledger FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));

-- Storage bucket for ticket images
INSERT INTO storage.buckets (id, name, public) VALUES ('ticket-images', 'ticket-images', true);

CREATE POLICY "Authenticated users can upload ticket images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'ticket-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Anyone can view ticket images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'ticket-images');
