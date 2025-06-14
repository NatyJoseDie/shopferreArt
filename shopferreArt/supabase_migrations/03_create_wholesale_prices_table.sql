CREATE TABLE wholesale_prices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  wholesale_price NUMERIC,
  markup_percentage NUMERIC,
  created_at TIMESTAMPTZ DEFAULT now()
);
