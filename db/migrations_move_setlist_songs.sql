-- Migration: Move songs and setlistSongMeta from setlists to setlist_songs

-- 1. For each setlist, parse songs (array of song IDs) and setlistSongMeta (JSON object)
-- 2. Insert each song into setlist_songs with position and meta

-- This migration is idempotent: it will not duplicate entries if run multiple times

INSERT INTO setlist_songs (setlist_id, song_id, position, meta, createdAt, updatedAt)
SELECT
  s.id as setlist_id,
  json_each.value as song_id,
  json_each.key as position,
  COALESCE(
    json_extract(s.setlistSongMeta, '$.' || json_each.value),
    '{}'
  ) as meta,
  s.createdAt,
  s.updatedAt
FROM setlists s,
  json_each(s.songs)
WHERE NOT EXISTS (
  SELECT 1 FROM setlist_songs ss WHERE ss.setlist_id = s.id AND ss.song_id = json_each.value
);
