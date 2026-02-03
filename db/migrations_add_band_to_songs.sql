-- Migration: Add bandId to songs table for band collaboration
-- This allows songs to be shared with band members

-- Add bandId column to songs table
ALTER TABLE songs ADD COLUMN bandId TEXT;

-- Add foreign key constraint (note: SQLite doesn't support adding FK after creation,
-- but we can add index for performance)
CREATE INDEX IF NOT EXISTS idx_songs_bandId ON songs(bandId);

-- Add index for userId for better query performance
CREATE INDEX IF NOT EXISTS idx_songs_userId ON songs(userId);

-- Note: Songs can be:
-- 1. Personal: userId set, bandId NULL
-- 2. Band: userId set (creator), bandId set (shared with band)
-- 3. Public: userId NULL, bandId NULL (template songs)
