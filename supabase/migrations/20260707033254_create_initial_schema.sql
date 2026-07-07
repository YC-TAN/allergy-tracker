CREATE TABLE IF NOT EXISTS daily_pollen_forecasts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    date date UNIQUE NOT NULL,
    pollen_type text NOT NULL,
    pollen_risk text NOT NULL CHECK (pollen_risk in ('low', 'moderate', 'high', 'imminent')),
    checked_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE daily_pollen_forecasts ENABLE ROW LEVEL SECURITY;

-- Create the "Read-Only" Policy
-- This allows anyone (authenticated or anonymous) to SELECT the data
CREATE POLICY "Allow public read access" 
ON daily_pollen_forecasts 
FOR SELECT 
TO anon, authenticated 
USING (true);