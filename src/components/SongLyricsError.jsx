import React from "react";

export default function SongLyricsError({ error }) {
  if (!error) return null;
  return <div className="song-lyrics-error">{error}</div>;
}
