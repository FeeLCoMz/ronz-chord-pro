-- Migration: Remove songs and setlistSongMeta columns from setlists table (after migration to setlist_songs)

ALTER TABLE setlists DROP COLUMN songs;
ALTER TABLE setlists DROP COLUMN setlistSongMeta;
