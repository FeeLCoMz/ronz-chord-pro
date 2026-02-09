-- Migration: Add setlist_songs join table for many-to-many relationship
-- between setlists and songs

CREATE TABLE IF NOT EXISTS setlist_songs (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  setlist_id TEXT NOT NULL,
  song_id TEXT NOT NULL,
  position INTEGER,
  meta TEXT,
  createdAt TEXT DEFAULT (datetime('now')),
  updatedAt TEXT,
  FOREIGN KEY (setlist_id) REFERENCES setlists(id) ON DELETE CASCADE,
  FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE,
  UNIQUE(setlist_id, song_id)
);

CREATE INDEX IF NOT EXISTS idx_setlist_songs_song_id ON setlist_songs(song_id);
CREATE INDEX IF NOT EXISTS idx_setlist_songs_setlist_id ON setlist_songs(setlist_id);
