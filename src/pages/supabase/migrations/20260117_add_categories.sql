INSERT INTO categories (name, slug)
VALUES 
  ('Arredi', 'arredi'),
  ('Decorazioni', 'decorazioni'),
  ('Illuminazione', 'illuminazione'),
  ('Tessili', 'tessili')
ON CONFLICT (slug) DO NOTHING;