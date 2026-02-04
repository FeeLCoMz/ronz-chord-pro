-- Add time_signature field to songs table with default 4/4
ALTER TABLE songs ADD COLUMN time_signature TEXT DEFAULT '4/4';
