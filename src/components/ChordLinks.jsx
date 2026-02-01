import React from 'react';

export default function ChordLinks({ searchQuery }) {
  if (!searchQuery) return null;

  return (
    <div style={{ marginTop: 20, padding: '16px', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px' }}>
      <div style={{ marginBottom: 12, fontWeight: 500, color: 'var(--text-primary)' }}>
        Cari chord di situs lain:
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
        <a
          href={`https://www.ultimate-guitar.com/search.php?search_type=title&value=${encodeURIComponent(searchQuery)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="tab-btn"
          style={{ padding: '8px 16px', textDecoration: 'none', width: '100%', maxWidth: 300 }}
        >
          🎸 Ultimate Guitar
        </a>
        <a
          href={`https://www.chordtela.com/?s=${encodeURIComponent(searchQuery)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="tab-btn"
          style={{ padding: '8px 16px', textDecoration: 'none', width: '100%', maxWidth: 300 }}
        >
          🎵 ChordTela
        </a>
        <a
          href={`https://www.google.com/search?q=${encodeURIComponent(searchQuery + ' chord')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="tab-btn"
          style={{ padding: '8px 16px', textDecoration: 'none', width: '100%', maxWidth: 300 }}
        >
          🔍 Google Search
        </a>
      </div>
    </div>
  );
}
