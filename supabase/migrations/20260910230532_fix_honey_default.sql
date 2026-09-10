ALTER TABLE entries ALTER COLUMN honey DROP DEFAULT;
UPDATE entries SET honey = NULL WHERE honey = false;