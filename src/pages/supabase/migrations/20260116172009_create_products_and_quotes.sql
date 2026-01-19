/*
  # Schema per sito vetrina shabby chic

  1. Nuove Tabelle
    - `categories` (categorie prodotti)
      - `id` (uuid, primary key)
      - `name` (text, nome categoria)
      - `slug` (text, url-friendly name)
      - `description` (text, descrizione categoria)
      - `created_at` (timestamp)
      
    - `products` (prodotti)
      - `id` (uuid, primary key)
      - `category_id` (uuid, foreign key)
      - `name` (text, nome prodotto)
      - `slug` (text, url-friendly name)
      - `description` (text, descrizione)
      - `price` (numeric, prezzo indicativo)
      - `image_url` (text, url immagine)
      - `features` (jsonb, caratteristiche del prodotto)
      - `is_featured` (boolean, prodotto in evidenza)
      - `created_at` (timestamp)
      
    - `quote_requests` (richieste preventivo)
      - `id` (uuid, primary key)
      - `product_id` (uuid, foreign key)
      - `customer_name` (text, nome cliente)
      - `customer_email` (text, email cliente)
      - `customer_phone` (text, telefono cliente)
      - `message` (text, messaggio aggiuntivo)
      - `quantity` (integer, quantità richiesta)
      - `status` (text, stato preventivo)
      - `created_at` (timestamp)

  2. Sicurezza
    - Enable RLS su tutte le tabelle
    - Categorie e prodotti leggibili pubblicamente
    - Quote requests: inserimento pubblico, lettura solo admin
*/

-- Tabella categorie
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Tabella prodotti
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  price numeric(10, 2) DEFAULT 0,
  image_url text DEFAULT '',
  features jsonb DEFAULT '[]'::jsonb,
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Tabella richieste preventivo
CREATE TABLE IF NOT EXISTS quote_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text DEFAULT '',
  message text DEFAULT '',
  quantity integer DEFAULT 1,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_requests ENABLE ROW LEVEL SECURITY;

-- Policies per categories (lettura pubblica)
CREATE POLICY "Categorie visibili pubblicamente"
  ON categories FOR SELECT
  TO anon
  USING (true);

-- Policies per products (lettura pubblica)
CREATE POLICY "Prodotti visibili pubblicamente"
  ON products FOR SELECT
  TO anon
  USING (true);

-- Policies per quote_requests (inserimento pubblico)
CREATE POLICY "Chiunque può richiedere preventivi"
  ON quote_requests FOR INSERT
  TO anon
  WITH CHECK (true);

-- Indici per performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_quote_requests_product ON quote_requests(product_id);
CREATE INDEX IF NOT EXISTS idx_quote_requests_status ON quote_requests(status);