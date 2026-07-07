CREATE TABLE IF NOT EXISTS daily_pollen_forecasts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    date date UNIQUE NOT NULL,
    pollen_type text NOT NULL,
    pollen_risk text NOT NULL CHECK (pollen_risk in ('low', 'moderate', 'high', 'imminent')),
    checked_at timestamptz DEFAULT now()
)