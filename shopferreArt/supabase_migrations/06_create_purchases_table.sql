CREATE TABLE purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  purchase_date TIMESTAMPTZ DEFAULT now(),
  total_cost NUMERIC NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN (
    'efectivo',
    'transferencia'
  )),
  supplier TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
