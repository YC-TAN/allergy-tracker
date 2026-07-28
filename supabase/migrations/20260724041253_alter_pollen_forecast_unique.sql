ALTER TABLE daily_pollen_forecasts
    ADD COLUMN location text NOT NULL,
    DROP CONSTRAINT daily_pollen_forecasts_date_key,
    ADD CONSTRAINT unique_date_location UNIQUE (date, location);