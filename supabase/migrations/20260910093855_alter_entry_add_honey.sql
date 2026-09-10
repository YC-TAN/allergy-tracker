-- Add honey to entries
ALTER TABLE entries
    ADD COLUMN honey boolean default false;