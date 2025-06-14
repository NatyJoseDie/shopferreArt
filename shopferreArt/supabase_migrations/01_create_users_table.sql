CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE,
  password_hash TEXT,
  user_type TEXT NOT NULL CHECK (user_type IN (
    'vendedora',
    'cliente'
  )),
  created_at TIMESTAMPTZ DEFAULT now()
);
