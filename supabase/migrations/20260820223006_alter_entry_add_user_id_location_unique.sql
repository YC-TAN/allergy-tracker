-- Add location and user_id to entries
-- Add unique of one user one entry per day
ALTER TABLE entries
    ADD COLUMN user_id uuid REFERENCES auth.users NOT NULL,
    ADD COLUMN location text NOT NULL,
    ADD CONSTRAINT entries_date_user_id_key UNIQUE (date, user_id);

ALTER TABLE entries ENABLE ROW LEVEL SECURITY;

-- Users can read their own entries only
CREATE POLICY "Users can read own entries"
    ON entries 
    FOR SELECT 
    USING (auth.uid() = user_id);