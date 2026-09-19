-- ====================================================================
-- SCHEMA SQL POUR YANLAMODE HAUTE COUTURE (SUPABASE POSTGRESQL)
-- ====================================================================

-- 1. Table des Paramètres du site
CREATE TABLE IF NOT EXISTS settings (
  id INT PRIMARY KEY DEFAULT 1,
  config JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Table des Collections
CREATE TABLE IF NOT EXISTS collections (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  cover_image TEXT,
  season TEXT,
  featured BOOLEAN DEFAULT true,
  creations_count INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Table des Créations
CREATE TABLE IF NOT EXISTS creations (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  ref TEXT UNIQUE NOT NULL,
  collection_id TEXT REFERENCES collections(id) ON DELETE SET NULL,
  category TEXT NOT NULL,
  gender TEXT NOT NULL,
  description TEXT,
  fabric TEXT,
  colors JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'Disponible sur commande',
  images JSONB DEFAULT '[]'::jsonb,
  featured BOOLEAN DEFAULT false,
  views_count INT DEFAULT 0,
  whatsapp_clicks_count INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Table des Demandes (Mini-CRM)
CREATE TABLE IF NOT EXISTS demandes (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL, -- 'creation', 'sur-mesure', 'contact'
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  email TEXT,
  creation_id TEXT REFERENCES creations(id) ON DELETE SET NULL,
  creation_title TEXT,
  gender TEXT,
  outfit_type TEXT,
  occasion TEXT,
  event_date TEXT,
  budget TEXT,
  measurements JSONB,
  description TEXT,
  inspiration_images JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'Nouveau', -- 'Nouveau', 'En discussion', 'Devis / Proposition', 'Confirmé', 'Terminé'
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Table des Événements Analytiques (Tracking)
CREATE TABLE IF NOT EXISTS analytics_events (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL, -- 'page_view', 'creation_view', 'whatsapp_click', 'demand_submit'
  path TEXT,
  creation_id TEXT,
  creation_title TEXT,
  source TEXT, -- 'Instagram', 'TikTok', 'WhatsApp', 'Google', 'Facebook', 'Direct'
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  device TEXT, -- 'Mobile', 'Desktop', 'Tablette'
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ====================================================================
-- SÉCURITÉ : Row Level Security (RLS)
-- ====================================================================

ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE creations ENABLE ROW LEVEL SECURITY;
ALTER TABLE demandes ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Politiques de lecture publique
CREATE POLICY "Lecture publique des paramètres" ON settings FOR SELECT USING (true);
CREATE POLICY "Lecture publique des collections" ON collections FOR SELECT USING (true);
CREATE POLICY "Lecture publique des créations" ON creations FOR SELECT USING (true);

-- Insertion publique des demandes (formulaire de contact et sur-mesure)
CREATE POLICY "Insertion anonyme des demandes" ON demandes FOR INSERT WITH CHECK (true);

-- Insertion publique des événements analytics
CREATE POLICY "Insertion anonyme analytics" ON analytics_events FOR INSERT WITH CHECK (true);

-- Accès complet réservé au rôle de service / admin authentifié
CREATE POLICY "Admin full access settings" ON settings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access collections" ON collections FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access creations" ON creations FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access demandes" ON demandes FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access analytics" ON analytics_events FOR ALL USING (auth.role() = 'authenticated');

-- ====================================================================
-- INDEX POUR PERFORMANCE MAXIMALE
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_creations_collection ON creations(collection_id);
CREATE INDEX IF NOT EXISTS idx_creations_category ON creations(category);
CREATE INDEX IF NOT EXISTS idx_creations_gender ON creations(gender);
CREATE INDEX IF NOT EXISTS idx_demandes_status ON demandes(status);
CREATE INDEX IF NOT EXISTS idx_analytics_timestamp ON analytics_events(timestamp);

-- ====================================================================
-- DONNÉES INITIALES (COLLECTIONS & CRÉATIONS RÉELLES FOURNIES)
-- ====================================================================

INSERT INTO collections (id, title, slug, description, cover_image, season, featured, creations_count)
VALUES
  ('col-haute-couture', 'Haute Couture', 'haute-couture', 'Créations d''exception pensées dans les moindres détails pour sublimer la silhouette avec une audace raffinée.', '/images/creations/robe-batik-franges.jpg', 'Édition Permanente', true, 4),
  ('col-ceremonie', 'Cérémonie & Soirée', 'ceremonie', 'Des silhouettes magistrales pensées pour les moments inoubliables. Smokings impeccables et tenues d''apparat.', '/images/creations/smoking-noir-prestige.jpg', 'Collection Prestige', true, 4),
  ('col-tradition-chic', 'Héritage & Tradition Chic', 'tradition-chic', 'L''art du textile d''Afrique magnifié par la précision et la rigueur de la haute couture moderne.', '/images/creations/agbada-noir-diamant.jpg', 'Collection Signature', true, 3),
  ('col-sur-mesure', 'Sur Mesure Exclusif', 'sur-mesure', 'Une pièce unique imaginée selon vos envies, votre morphologie exacte et vos événements les plus précieux.', '/images/creations/costume-croise-rose.jpg', 'Atelier Privé', true, 10)
ON CONFLICT (id) DO NOTHING;

INSERT INTO creations (id, title, slug, ref, collection_id, category, gender, description, fabric, colors, status, images, featured, views_count, whatsapp_clicks_count)
VALUES
  ('crea-01', 'Costume Croisé Rose Poudré & Boutons d''Or', 'costume-croise-rose-poudre-et-or', 'YM-HC-001', 'col-ceremonie', 'Costume & Smoking', 'Homme', 'Veste croisée masculine ajustée dans une teinte rose poudré subtile et moderne, rehaussée de boutons dorés brossés et d''une pochette en soie à motifs géométriques.', 'Drap de laine froide superfine 150s & doublure satin de soie', '["Rose Poudré", "Boutons Or", "Blanc Soie"]'::jsonb, 'Disponible sur commande', '["/images/creations/costume-croise-rose.jpg"]'::jsonb, true, 342, 48),
  ('crea-02', 'Smoking Vert Sauge Col Châle Arrondi', 'smoking-vert-sauge-col-chale', 'YM-HC-002', 'col-ceremonie', 'Costume & Smoking', 'Homme', 'Smoking couture à col châle généreux et arrondi dans une nuance vert sauge contemporaine. Boutons recouverts de tissu ton sur ton et fentes discrètes.', 'Laine italienne peignée & revers satin mat', '["Vert Sauge", "Noir Satin"]'::jsonb, 'Création sur mesure', '["/images/creations/smoking-vert-sauge.jpg"]'::jsonb, true, 289, 39),
  ('crea-03', 'Agbada Haute Couture Noir Relief Diamant', 'agbada-haute-couture-noir-relief', 'YM-HC-003', 'col-tradition-chic', 'Traditionnel Chic', 'Homme', 'Ensemble d''apparat masculin composé d''un agbada à structure matelassée en losanges géométriques, pantalon tailleur assorti et coiffe traditionnelle.', 'Coton damassé texturé lourd & finitions au fil de soie', '["Noir Profond"]'::jsonb, 'Disponible sur commande', '["/images/creations/agbada-noir-diamant.jpg"]'::jsonb, true, 520, 76),
  ('crea-04', 'Smoking Croisé Noir Prestige & Revers Satin', 'smoking-croise-noir-prestige', 'YM-HC-004', 'col-ceremonie', 'Costume & Smoking', 'Homme', 'Le summum de l''élégance formelle. Veste croisée noire au tombé sculptural, revers en satin de soie noir brillant et nœud papillon en velours.', 'Laine noble mérinos & satin de soie duchesse', '["Noir Intense", "Blanc Pur"]'::jsonb, 'Disponible sur commande', '["/images/creations/smoking-noir-prestige.jpg"]'::jsonb, true, 461, 63),
  ('crea-05', 'Ensemble Épure Blanc Brodé Volière & Oiseaux', 'ensemble-epure-blanc-brode-voliere', 'YM-HC-005', 'col-haute-couture', 'Haute Couture', 'Homme', 'Tunique oversize à manches courtes en lin immaculé ornée d''une broderie d''art figurant une cage et des oiseaux prenant leur envol, avec pantalon à pinces fluide.', 'Lin lourd premium & broderie d''art au point de croix', '["Blanc Craie", "Noir de Chine"]'::jsonb, 'Disponible sur commande', '["/images/creations/ensemble-blanc-oiseau.jpg"]'::jsonb, true, 395, 52),
  ('crea-06', 'Gilet d''Apparat Croisé & Coiffe Royale', 'gilet-apparat-croise-blanc-coiffe', 'YM-HC-006', 'col-ceremonie', 'Cérémonie', 'Homme', 'Gilet long sans manches croisé blanc immaculé sur chemise rayée à manchettes montantes, complété d''une coiffe royale en velours rouge brodée d''or.', 'Crêpe de laine blanc nacré & velours de soie pourpre', '["Blanc Éclatant", "Bleu Rayé", "Rouge Impérial"]'::jsonb, 'Création sur mesure', '["/images/creations/costume-ceremonie-blanc-rouge.jpg"]'::jsonb, true, 310, 41),
  ('crea-07', 'Robe Tunique Batik Indigo & Plastron Tissé', 'robe-tunique-batik-indigo-plastron-tisse', 'YM-HC-007', 'col-haute-couture', 'Haute Couture', 'Femme', 'Création spectaculaire mêlant batik contemporain à motifs marbrés verticaux et plastron artisanal tissé main à rayures et franges vibrantes.', 'Batik artisanal coton peigné & tissage traditionnel Baoulé', '["Indigo Nuit", "Écru Naturel", "Rouge Terre"]'::jsonb, 'Disponible sur commande', '["/images/creations/robe-batik-franges.jpg"]'::jsonb, true, 488, 67),
  ('crea-08', 'Tunique Haute Couture Dentelle Suisse Ajourée', 'tunique-dentelle-suisse-ajouree', 'YM-HC-008', 'col-tradition-chic', 'Traditionnel Chic', 'Homme', 'Tunique masculine prestigieuse en dentelle suisse perforée à motifs géométriques et œillets d''art, boutonnage discret à col officier.', 'Véritable dentelle suisse de coton brodé ajouré', '["Blanc Pur"]'::jsonb, 'Disponible sur commande', '["/images/creations/tunique-dentelle-suisse.jpg"]'::jsonb, false, 275, 33),
  ('crea-09', 'Robe Maxi Batik Majesté & Plastron Cuivré', 'robe-maxi-batik-majeste-plastron-cuivre', 'YM-HC-009', 'col-haute-couture', 'Haute Couture', 'Femme', 'Robe longue architecturale avec découpes en wax batik indigo et écru, plastron asymétrique cuivré métallisé et coiffe assortie.', 'Batik authentique teinté à la cuve & soie mordorée', '["Bleu Nuit", "Bronze Cuivre", "Blanc Craie"]'::jsonb, 'Création sur mesure', '["/images/creations/robe-maxi-batik-bronze.jpg"]'::jsonb, true, 390, 54),
  ('crea-10', 'Robe Éditoriale Batik Géométrique & Voile Violet', 'robe-editoriale-batik-violet', 'YM-HC-010', 'col-haute-couture', 'Haute Couture', 'Femme', 'Robe kimono fluide associant motifs floraux géométriques indigo, col officier graphique et ourlet inférieur teinté en violet pourpre.', 'Coton batik bicolore et soie satinée violette', '["Indigo", "Violet Pourpre", "Lavande"]'::jsonb, 'Disponible sur commande', '["/images/creations/robe-tunique-violet-indigo.jpg"]'::jsonb, false, 330, 42)
ON CONFLICT (id) DO NOTHING;

