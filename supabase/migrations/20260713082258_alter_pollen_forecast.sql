-- Alter table column to mirror the API response

ALTER Table daily_pollen_forecasts 
    DROP COLUMN pollen_type,
    DROP COLUMN pollen_risk,
    ADD COLUMN imminent JSONB NOT NULL DEFAULT '[]'::jsonb,
    ADD COLUMN low JSONB NOT NULL DEFAULT '[]'::jsonb,
    ADD COLUMN moderate JSONB NOT NULL DEFAULT '[]'::jsonb,
    ADD COLUMN high JSONB NOT NULL DEFAULT '[]'::jsonb;