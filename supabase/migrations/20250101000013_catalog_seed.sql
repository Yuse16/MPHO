-- =============================================================================
-- Migration 013: Catalog seed data
-- =============================================================================
-- Seeds categories, tags, products, listings, and media for development.
-- All data is fictional and for Saltillo only.
-- Cities and zones are seeded by migrations 004 and seed.sql.
-- =============================================================================

-- ─── Product Categories ──────────────────────────────────────────────────────
INSERT INTO categories (id, name, slug, type, description, sort_order) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'Flores', 'flores', 'product', 'Ramos y arreglos florales', 1),
  ('a1000000-0000-0000-0000-000000000002', 'Chocolates', 'chocolates', 'product', 'Cajas y selecciones de chocolate', 2),
  ('a1000000-0000-0000-0000-000000000003', 'Globos', 'globos', 'product', 'Globos decorativos y bouquets', 3),
  ('a1000000-0000-0000-0000-000000000004', 'Tazas y Vasos', 'tazas-vasos', 'product', 'Tazas, vasos y artículos personalizados', 4),
  ('a1000000-0000-0000-0000-000000000005', 'Peluches', 'peluches', 'product', 'Juguetes y peluches', 5),
  ('a1000000-0000-0000-0000-000000000006', 'Cajas de Regalo', 'cajas-regalo', 'product', 'Cajas y sets de regalo', 6),
  ('a1000000-0000-0000-0000-000000000007', 'Personalizados', 'personalizados', 'product', 'Artículos con nombre, foto o mensaje', 7),
  ('a1000000-0000-0000-0000-000000000008', 'Dulces y Postres', 'dulces-postres', 'product', 'Dulcería, pastelería y postres', 8),
  ('a1000000-0000-0000-0000-000000000009', 'Belleza y Bienestar', 'belleza-bienestar', 'product', 'Sets de spa, fragancias y cuidado personal', 9),
  ('a1000000-0000-0000-0000-000000000010', 'Accesorios', 'accesorios', 'product', 'Joyería, carteras y accesorios', 10)
ON CONFLICT (slug) DO NOTHING;

-- ─── Occasion Categories ─────────────────────────────────────────────────────
INSERT INTO categories (id, name, slug, type, description, sort_order) VALUES
  ('b1000000-0000-0000-0000-000000000001', 'Cumpleaños', 'cumpleanos', 'occasion', 'Celebración de cumpleaños', 1),
  ('b1000000-0000-0000-0000-000000000002', 'Aniversario', 'aniversario', 'occasion', 'Celebración de aniversario', 2),
  ('b1000000-0000-0000-0000-000000000003', 'Amor y Amistad', 'amor-amistad', 'occasion', 'Día del amor y la amistad', 3),
  ('b1000000-0000-0000-0000-000000000004', 'Día de las Madres', 'dia-madres', 'occasion', 'Homenaje a las mamás', 4),
  ('b1000000-0000-0000-0000-000000000005', 'Día de los Padres', 'dia-padres', 'occasion', 'Homenaje a los papás', 5),
  ('b1000000-0000-0000-0000-000000000006', 'Graduación', 'graduacion', 'occasion', 'Ceremonia de graduación', 6),
  ('b1000000-0000-0000-0000-000000000007', 'Gracias', 'gracias', 'occasion', 'Agradecimiento', 7),
  ('b1000000-0000-0000-0000-000000000008', 'Felicidades', 'felicidades', 'occasion', 'Logro o nueva etapa', 8),
  ('b1000000-0000-0000-0000-000000000009', 'Solo porque sí', 'solo-porque-si', 'occasion', 'Regalo sin ocasión específica', 9),
  ('b1000000-0000-0000-0000-000000000010', 'Navidad', 'navidad', 'occasion', 'Festividades navideñas', 10)
ON CONFLICT (slug) DO NOTHING;

-- ─── Recipient Categories ────────────────────────────────────────────────────
INSERT INTO categories (id, name, slug, type, description, sort_order) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'Pareja', 'para-pareja', 'recipient', 'Regalo para tu pareja', 1),
  ('c1000000-0000-0000-0000-000000000002', 'Mamá', 'para-mama', 'recipient', 'Regalo para tu mamá', 2),
  ('c1000000-0000-0000-0000-000000000003', 'Papá', 'para-papa', 'recipient', 'Regalo para tu papá', 3),
  ('c1000000-0000-0000-0000-000000000004', 'Amistad', 'para-amistad', 'recipient', 'Regalo para un amigo', 4),
  ('c1000000-0000-0000-0000-000000000005', 'Hermano(a)', 'para-hermano', 'recipient', 'Regalo para tu hermano o hermana', 5),
  ('c1000000-0000-0000-0000-000000000006', 'Compañero(a) de trabajo', 'para-companero', 'recipient', 'Regalo para un colega', 6),
  ('c1000000-0000-0000-0000-000000000007', 'Bebé', 'para-bebe', 'recipient', 'Regalo para un bebé recién nacido', 7),
  ('c1000000-0000-0000-0000-000000000008', 'Maestro(a)', 'para-maestro', 'recipient', 'Regalo para un profesor', 8)
ON CONFLICT (slug) DO NOTHING;

-- ─── Tags ────────────────────────────────────────────────────────────────────
INSERT INTO tags (id, name, slug, type) VALUES
  ('d1000000-0000-0000-0000-000000000001', 'Romántico', 'romantico', 'style'),
  ('d1000000-0000-0000-0000-000000000002', 'Elegante', 'elegante', 'style'),
  ('d1000000-0000-0000-0000-000000000003', 'Divertido', 'divertido', 'style'),
  ('d1000000-0000-0000-0000-000000000004', 'Útil', 'util', 'style'),
  ('d1000000-0000-0000-0000-000000000005', 'Premium', 'premium', 'style'),
  ('d1000000-0000-0000-0000-000000000006', 'Minimalista', 'minimalista', 'style'),
  ('d1000000-0000-0000-0000-000000000007', 'Personalizado', 'personalizado', 'feature'),
  ('d1000000-0000-0000-0000-000000000008', 'Entrega el mismo día', 'entrega-mismo-dia', 'delivery'),
  ('d1000000-0000-0000-0000-000000000009', 'Amigable con el presupuesto', 'budget-friendly', 'style'),
  ('d1000000-0000-0000-0000-000000000010', 'Local', 'local', 'feature'),
  ('d1000000-0000-0000-0000-000000000011', 'Temporada', 'temporada', 'seasonal')
ON CONFLICT (slug) DO NOTHING;

-- ─── Products ────────────────────────────────────────────────────────────────
INSERT INTO products (id, name, slug, description, product_type, category_id, status) VALUES
  -- Flores
  ('e1000000-0000-0000-0000-000000000001', 'Rosas Premium', 'rosas-premium', 'Caja elegante con 24 rosas rojas frescas, ideal para sorprender en cualquier ocasión.', 'product', 'a1000000-0000-0000-0000-000000000001', 'active'),
  ('e1000000-0000-0000-0000-000000000002', 'Ramo Girasoles', 'ramo-girasoles', 'Ramo alegre de girasoles con eucalipto, perfecto para alegrar el día.', 'product', 'a1000000-0000-0000-0000-000000000001', 'active'),
  ('e1000000-0000-0000-0000-000000000003', 'Arreglo Floral Elegante', 'arreglo-floral-elegante', 'Arreglo de rosas blancas, lirios y verde ornamental en jarrón de cerámica.', 'product', 'a1000000-0000-0000-0000-000000000001', 'active'),

  -- Chocolates
  ('e1000000-0000-0000-0000-000000000004', 'Selección de Trufas', 'seleccion-trufas', 'Caja de 12 trufas de chocolate belga, edición gourmet.', 'product', 'a1000000-0000-0000-0000-000000000002', 'active'),
  ('e1000000-0000-0000-0000-000000000005', 'Chocolates de Autor', 'chocolates-autor', 'Caja de 16 chocolates artesanales con sabores únicos.', 'product', 'a1000000-0000-0000-0000-000000000002', 'active'),

  -- Cajas de Regalo
  ('e1000000-0000-0000-0000-000000000006', 'Momento para Ella', 'momento-para-ella', 'Set de bienestar premium: vela aromática, crema para manos, bomba de baño y chocolates.', 'bundle', 'a1000000-0000-0000-0000-000000000006', 'active'),
  ('e1000000-0000-0000-0000-000000000007', 'Caja Gourmet Deluxe', 'caja-gourmet-deluxe', 'Chocolates, vino tinto y galletas artesanales en caja de madera.', 'bundle', 'a1000000-0000-0000-0000-000000000006', 'active'),

  -- Dulces
  ('e1000000-0000-0000-0000-000000000008', 'Galletas Decoradas', 'galletas-decoradas', 'Pack de 6 galletas de mantequilla decoradas a mano.', 'product', 'a1000000-0000-0000-0000-000000000008', 'active'),

  -- Peluches
  ('e1000000-0000-0000-0000-000000000009', 'Oso Peluche Gigante', 'oso-peluche-gigante', 'Oso de peluche de 60cm, suave y abrazable.', 'product', 'a1000000-0000-0000-0000-000000000005', 'active'),

  -- Belleza
  ('e1000000-0000-0000-0000-000000000010', 'Set de Spa Premium', 'set-spa-premium', 'Vela, sales de baño, aceite esencial y mascarilla facial en caja de regalo.', 'bundle', 'a1000000-0000-0000-0000-000000000009', 'active'),

  -- Personalizados
  ('e1000000-0000-0000-0000-000000000011', 'Taza Personalizada Foto', 'taza-personalizada-foto', 'Taza de cerámica de 11oz con tu foto impresa en alta resolución.', 'product', 'a1000000-0000-0000-0000-000000000007', 'active'),
  ('e1000000-0000-0000-0000-000000000012', 'Llavero Personalizado', 'llavero-personalizado', 'Llavero de acrílico con nombre y fecha personalizados.', 'product', 'a1000000-0000-0000-0000-000000000007', 'active')
ON CONFLICT (slug) DO NOTHING;

-- ─── Listings (all published in Saltillo) ────────────────────────────────────
-- Seed Saltillo zones (also in seed.sql for idempotency) and create listings
DO $$
DECLARE
  v_city_id uuid;
  v_zone_id uuid;
  v_ra_city_id uuid;
BEGIN
  SELECT id INTO v_city_id FROM cities WHERE name = 'Saltillo' AND state = 'Coahuila' LIMIT 1;

  IF v_city_id IS NULL THEN
    RAISE NOTICE 'Saltillo city not found, skipping listing seed';
    RETURN;
  END IF;

  -- Ensure Saltillo zones exist (seed.sql runs after migrations)
  INSERT INTO zones (city_id, name, slug, status, postal_codes, mphora_enabled)
  VALUES
    (v_city_id, 'Centro', 'centro', 'active', ARRAY['66000', '66001'], true),
    (v_city_id, 'Macroplaza', 'macroplaza', 'active', ARRAY['66010', '66011'], true),
    (v_city_id, 'Tecnológico', 'tecnologico', 'active', ARRAY['66020', '66021'], false),
    (v_city_id, 'San Francisco', 'san-francisco', 'active', ARRAY['66030', '66031'], false),
    (v_city_id, 'Obispado', 'obispado', 'active', ARRAY['66040', '66041'], false)
  ON CONFLICT (city_id, slug) DO NOTHING;

  -- Also seed Ramos Arizpe zones (planned)
  SELECT id INTO v_ra_city_id FROM cities WHERE name = 'Ramos Arizpe' AND state = 'Coahuila' LIMIT 1;
  IF v_ra_city_id IS NOT NULL THEN
    INSERT INTO zones (city_id, name, slug, status, postal_codes, mphora_enabled)
    VALUES
      (v_ra_city_id, 'Centro', 'centro', 'planned', ARRAY['25900'], false),
      (v_ra_city_id, 'Industrial', 'industrial', 'planned', ARRAY['25901'], false)
    ON CONFLICT (city_id, slug) DO NOTHING;
  END IF;

  SELECT id INTO v_zone_id FROM zones WHERE city_id = v_city_id AND slug = 'centro' LIMIT 1;

  IF v_zone_id IS NULL THEN
    SELECT id INTO v_zone_id FROM zones WHERE city_id = v_city_id LIMIT 1;
  END IF;

  IF v_zone_id IS NULL THEN
    RAISE NOTICE 'No zones found for Saltillo, skipping listing seed';
    RETURN;
  END IF;

  INSERT INTO listings (id, product_id, partner_id, source_type, customer_title, customer_description, status, availability_mode, base_price_amount_minor, currency, preparation_minutes, published_at)
  VALUES
    ('f1000000-0000-0000-0000-000000000001', 'e1000000-0000-0000-0000-000000000001', NULL, 'external_curated', 'Rosas Premium', 'Caja elegante con 24 rosas rojas frescas. Incluye tarjeta personalizada.', 'published', 'partner_confirmation', 129000, 'MXN', 60, now()),
    ('f1000000-0000-0000-0000-000000000002', 'e1000000-0000-0000-0000-000000000002', NULL, 'external_curated', 'Ramo Girasoles', 'Ramo alegre de girasoles frescos con eucalipto y lista de regalo.', 'published', 'partner_confirmation', 89000, 'MXN', 45, now()),
    ('f1000000-0000-0000-0000-000000000003', 'e1000000-0000-0000-0000-000000000003', NULL, 'external_curated', 'Arreglo Floral Elegante', 'Arreglo de rosas blancas, lirios y verde ornamental en jarrón de cerámica.', 'published', 'partner_confirmation', 159000, 'MXN', 90, now()),
    ('f1000000-0000-0000-0000-000000000004', 'e1000000-0000-0000-0000-000000000004', NULL, 'external_curated', 'Selección de Trufas', 'Caja de 12 trufas de chocolate belga, edición gourmet.', 'published', 'partner_confirmation', 89000, 'MXN', 30, now()),
    ('f1000000-0000-0000-0000-000000000005', 'e1000000-0000-0000-0000-000000000005', NULL, 'external_curated', 'Chocolates de Autor', 'Caja de 16 chocolates artesanales con sabores únicos de la región.', 'published', 'partner_confirmation', 119000, 'MXN', 30, now()),
    ('f1000000-0000-0000-0000-000000000006', 'e1000000-0000-0000-0000-000000000006', NULL, 'external_curated', 'Momento para Ella', 'Set de bienestar premium con vela aromática, crema, bomba de baño y chocolates.', 'published', 'partner_confirmation', 159000, 'MXN', 60, now()),
    ('f1000000-0000-0000-0000-000000000007', 'e1000000-0000-0000-0000-000000000007', NULL, 'external_curated', 'Caja Gourmet Deluxe', 'Chocolates, vino tinto y galletas artesanales en caja de madera.', 'published', 'partner_confirmation', 219000, 'MXN', 60, now()),
    ('f1000000-0000-0000-0000-000000000008', 'e1000000-0000-0000-0000-000000000008', NULL, 'external_curated', 'Galletas Decoradas', 'Pack de 6 galletas de mantequilla decoradas a mano con mensajes personalizados.', 'published', 'partner_confirmation', 45000, 'MXN', 45, now()),
    ('f1000000-0000-0000-0000-000000000009', 'e1000000-0000-0000-0000-000000000009', NULL, 'external_curated', 'Oso Peluche Gigante', 'Oso de peluche de 60cm, suave y abrazable. Acompaña con tarjeta.', 'published', 'partner_confirmation', 69000, 'MXN', 30, now()),
    ('f1000000-0000-0000-0000-000000000010', 'e1000000-0000-0000-0000-000000000010', NULL, 'external_curated', 'Set de Spa Premium', 'Vela, sales de baño, aceite esencial y mascarilla facial en caja de regalo.', 'published', 'partner_confirmation', 139000, 'MXN', 60, now()),
    ('f1000000-0000-0000-0000-000000000011', 'e1000000-0000-0000-0000-000000000011', NULL, 'external_curated', 'Taza Personalizada Foto', 'Taza de cerámica de 11oz con tu foto impresa en alta resolución.', 'published', 'partner_confirmation', 35000, 'MXN', 120, now()),
    ('f1000000-0000-0000-0000-000000000012', 'e1000000-0000-0000-0000-000000000012', NULL, 'external_curated', 'Llavero Personalizado', 'Llavero de acrílico con nombre y fecha personalizados.', 'published', 'partner_confirmation', 25000, 'MXN', 120, now())
  ON CONFLICT (id) DO NOTHING;

  -- Assign all published listings to the Saltillo Centro zone
  INSERT INTO listing_zones (listing_id, zone_id, status)
  SELECT l.id, v_zone_id, 'active'
  FROM listings l
  WHERE l.status = 'published'
  ON CONFLICT (listing_id, zone_id) DO NOTHING;

END $$;

-- ─── Product Tags ────────────────────────────────────────────────────────────
INSERT INTO product_tags (product_id, tag_id) VALUES
  -- Rosas Premium
  ('e1000000-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000001'), -- romántico
  ('e1000000-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000002'), -- elegante
  ('e1000000-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000005'), -- premium
  -- Ramo Girasoles
  ('e1000000-0000-0000-0000-000000000002', 'd1000000-0000-0000-0000-000000000003'), -- divertido
  ('e1000000-0000-0000-0000-000000000002', 'd1000000-0000-0000-0000-000000000010'), -- local
  -- Arreglo Floral
  ('e1000000-0000-0000-0000-000000000003', 'd1000000-0000-0000-0000-000000000002'), -- elegante
  ('e1000000-0000-0000-0000-000000000003', 'd1000000-0000-0000-0000-000000000005'), -- premium
  -- Trufas
  ('e1000000-0000-0000-0000-000000000004', 'd1000000-0000-0000-0000-000000000002'), -- elegante
  ('e1000000-0000-0000-0000-000000000004', 'd1000000-0000-0000-0000-000000000008'), -- entrega mismo día
  -- Chocolates de Autor
  ('e1000000-0000-0000-0000-000000000005', 'd1000000-0000-0000-0000-000000000005'), -- premium
  ('e1000000-0000-0000-0000-000000000005', 'd1000000-0000-0000-0000-000000000010'), -- local
  -- Momento para Ella
  ('e1000000-0000-0000-0000-000000000006', 'd1000000-0000-0000-0000-000000000002'), -- elegante
  ('e1000000-0000-0000-0000-000000000006', 'd1000000-0000-0000-0000-000000000005'), -- premium
  ('e1000000-0000-0000-0000-000000000006', 'd1000000-0000-0000-0000-000000000008'), -- entrega mismo día
  -- Caja Gourmet Deluxe
  ('e1000000-0000-0000-0000-000000000007', 'd1000000-0000-0000-0000-000000000005'), -- premium
  -- Galletas
  ('e1000000-0000-0000-0000-000000000008', 'd1000000-0000-0000-0000-000000000003'), -- divertido
  ('e1000000-0000-0000-0000-000000000008', 'd1000000-0000-0000-0000-000000000007'), -- personalizado
  -- Oso Peluche
  ('e1000000-0000-0000-0000-000000000009', 'd1000000-0000-0000-0000-000000000003'), -- divertido
  ('e1000000-0000-0000-0000-000000000009', 'd1000000-0000-0000-0000-000000000009'), -- budget-friendly
  -- Spa
  ('e1000000-0000-0000-0000-000000000010', 'd1000000-0000-0000-0000-000000000002'), -- elegante
  ('e1000000-0000-0000-0000-000000000010', 'd1000000-0000-0000-0000-000000000005'), -- premium
  -- Taza Personalizada
  ('e1000000-0000-0000-0000-000000000011', 'd1000000-0000-0000-0000-000000000007'), -- personalizado
  ('e1000000-0000-0000-0000-000000000011', 'd1000000-0000-0000-0000-000000000009'), -- budget-friendly
  -- Llavero
  ('e1000000-0000-0000-0000-000000000012', 'd1000000-0000-0000-0000-000000000007'), -- personalizado
  ('e1000000-0000-0000-0000-000000000012', 'd1000000-0000-0000-0000-000000000009')  -- budget-friendly
ON CONFLICT DO NOTHING;

-- ─── Media Assets ────────────────────────────────────────────────────────────
INSERT INTO media_assets (owner_type, owner_id, storage_bucket, storage_path, visibility, mime_type, alt_text, sort_order) VALUES
  ('product', 'e1000000-0000-0000-0000-000000000001', 'public', 'products/rosas-premium.jpg', 'public', 'image/jpeg', 'Caja negra elegante con 24 rosas rojas premium', 0),
  ('product', 'e1000000-0000-0000-0000-000000000002', 'public', 'products/ramo-girasoles.jpg', 'public', 'image/jpeg', 'Ramo alegre de girasoles con eucalipto', 0),
  ('product', 'e1000000-0000-0000-0000-000000000003', 'public', 'products/arreglo-floral.jpg', 'public', 'image/jpeg', 'Arreglo floral de rosas blancas y lirios', 0),
  ('product', 'e1000000-0000-0000-0000-000000000004', 'public', 'products/trufas.jpg', 'public', 'image/jpeg', 'Caja de trufas de chocolate belga', 0),
  ('product', 'e1000000-0000-0000-0000-000000000005', 'public', 'products/chocolates-autor.jpg', 'public', 'image/jpeg', 'Caja de chocolates artesanales de autor', 0),
  ('product', 'e1000000-0000-0000-0000-000000000006', 'public', 'products/momento-ella.jpg', 'public', 'image/jpeg', 'Set de bienestar premium con vela y chocolates', 0),
  ('product', 'e1000000-0000-0000-0000-000000000007', 'public', 'products/caja-gourmet.jpg', 'public', 'image/jpeg', 'Caja gourmet con chocolates y vino', 0),
  ('product', 'e1000000-0000-0000-0000-000000000008', 'public', 'products/galletas.jpg', 'public', 'image/jpeg', 'Galletas decoradas con mensajes', 0),
  ('product', 'e1000000-0000-0000-0000-000000000009', 'public', 'products/oso-peluche.jpg', 'public', 'image/jpeg', 'Oso peluche gigante de 60cm', 0),
  ('product', 'e1000000-0000-0000-0000-000000000010', 'public', 'products/set-spa.jpg', 'public', 'image/jpeg', 'Set de spa premium en caja de regalo', 0),
  ('product', 'e1000000-0000-0000-0000-000000000011', 'public', 'products/taza-foto.jpg', 'public', 'image/jpeg', 'Taza personalizada con foto', 0),
  ('product', 'e1000000-0000-0000-0000-000000000012', 'public', 'products/llavero.jpg', 'public', 'image/jpeg', 'Llavero personalizado de acrílico', 0)
ON CONFLICT DO NOTHING;
