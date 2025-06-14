CREATE TABLE sales (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  sale_type TEXT NOT NULL CHECK (sale_type IN (
    'consumidor_final',
    'mayorista'
  )),
  total_amount NUMERIC NOT NULL,
  sale_date TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);
