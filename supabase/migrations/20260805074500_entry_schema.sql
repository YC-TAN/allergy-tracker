CREATE TABLE IF NOT EXISTS entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL,
    severity INT CHECK (severity BETWEEN 0 and 3),
    symptoms JSONB,
    notes TEXT,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE entries ENABLE ROW LEVEL SECURITY;