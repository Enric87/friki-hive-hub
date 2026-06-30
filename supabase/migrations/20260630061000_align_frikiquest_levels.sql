-- Align loyalty levels with the FrikiQuest product model.
DELETE FROM public.levels;

INSERT INTO public.levels (name, min_points, icon, benefits, sort_order) VALUES
  ('Novato', 0, '🎮', ARRAY['Acceso a sorteos básicos'], 1),
  ('Iniciado', 500, '✨', ARRAY['5% descuento en eventos', 'Acceso anticipado a reservas'], 2),
  ('Veterano', 1500, '🛡️', ARRAY['10% descuento en eventos', 'Doble puntos en cumpleaños'], 3),
  ('Élite', 3000, '⚔️', ARRAY['15% descuento en productos seleccionados', 'Reservas prioritarias'], 4),
  ('Leyenda', 6000, '👑', ARRAY['20% descuento en eventos', 'Acceso VIP a sorteos', 'Regalos exclusivos'], 5);

UPDATE public.profiles
SET level = (
  SELECT name
  FROM public.levels
  WHERE min_points <= profiles.points
  ORDER BY min_points DESC
  LIMIT 1
);
