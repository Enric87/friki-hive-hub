-- Add tags column to rewards for labels like "Popular", "Limitado", "Exclusivo"
ALTER TABLE public.rewards ADD COLUMN tags text[] DEFAULT '{}'::text[];