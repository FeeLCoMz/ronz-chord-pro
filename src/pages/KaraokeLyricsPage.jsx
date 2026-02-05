import React, { useState, useEffect, useRef } from 'react';
import '../styles/karaoke.css';
import { useParams } from 'react-router-dom';
import { getAuthHeader } from '../utils/auth.js';

// KaraokeLyricsPage: Penampil lirik fullscreen untuk penyanyi/karaoke
export default function KaraokeLyricsPage() {
  const { id } = useParams();
  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fullscreen, setFullscreen] = useState(false);
  const lyricsRef = useRef(null);
  const [activeLine, setActiveLine] = useState(0);
  const [autoScroll, setAutoScroll] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(2500); // ms per line
  const [darkMode, setDarkMode] = useState(false);

  // Fetch song data by ID
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/songs/${id}`, { headers: getAuthHeader() })
      .then(res => res.ok ? res.json() : Promise.reject('Gagal memuat lagu'))
      .then(data => {
        setSong(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, [id]);

  // Fullscreen handler
  const handleFullscreen = () => {
    setFullscreen(true);
    setTimeout(() => {
      if (lyricsRef.current) {
        if (lyricsRef.current.requestFullscreen) {
          lyricsRef.current.requestFullscreen();
        } else if (window.parent) {
          window.parent.document.body.requestFullscreen?.();
        }
      }
    }, 100);
  };

  // Exit fullscreen on ESC or fullscreenchange
  useEffect(() => {
    const exitHandler = () => {
      if (!document.fullscreenElement) {
        setFullscreen(false);
      }
    };
    document.addEventListener('fullscreenchange', exitHandler);
    return () => document.removeEventListener('fullscreenchange', exitHandler);
  }, []);

  // Split lyrics into lines
  const lyricLines = song && song.lyrics ? song.lyrics.split(/\r?\n/) : [];

  // Auto-scroll effect
  useEffect(() => {
    if (!autoScroll || lyricLines.length === 0) return;
    setActiveLine(0);
    let lineIdx = 0;
    const interval = setInterval(() => {
      lineIdx++;
      if (lineIdx < lyricLines.length) {
        setActiveLine(lineIdx);
        // Scroll to active line
        const el = document.getElementById(`karaoke-line-${lineIdx}`);
        if (el && fullscreen) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      } else {
        clearInterval(interval);
        setAutoScroll(false);
      }
    }, scrollSpeed);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [autoScroll, fullscreen, song && song.lyrics, scrollSpeed]);

  // Render loading/error/null after all hooks
  if (loading) return <div className="page-container"><div className="card">Memuat lirik...</div></div>;
  if (error) return <div className="page-container"><div className="card">{error}</div></div>;
  if (!song) return null;

  return (
    <div className={`karaoke-lyrics-page${fullscreen ? ' fullscreen' : ''}${darkMode ? ' dark-mode' : ''}`} ref={lyricsRef}>
      <div className="karaoke-header">
        <h1 className="karaoke-title">{song.title}</h1>
        <p className="karaoke-artist">{song.artist}</p>
        {!fullscreen && (
          <button className="btn btn-primary" onClick={handleFullscreen}>Layar Penuh</button>
        )}
        <button className="btn btn-secondary" onClick={() => setAutoScroll(s => !s)}>
          {autoScroll ? 'Pause Auto-Scroll' : 'Mulai Auto-Scroll'}
        </button>
        <label style={{ marginLeft: 16 }}>
          Kecepatan: <input type="number" min="500" max="10000" step="100" value={scrollSpeed} onChange={e => setScrollSpeed(Number(e.target.value))} style={{ width: 80 }} /> ms/baris
        </label>
        <button className="btn btn-secondary" style={{ marginLeft: 16 }} onClick={() => setDarkMode(d => !d)}>
          {darkMode ? 'Mode Terang' : 'Mode Gelap'}
        </button>
        <div style={{ marginTop: 16 }}>
          <button className="btn" onClick={() => setActiveLine(l => Math.max(0, l - 1))} disabled={activeLine === 0}>⬆️ Baris Sebelumnya</button>
          <button className="btn" onClick={() => setActiveLine(l => Math.min(lyricLines.length - 1, l + 1))} disabled={activeLine === lyricLines.length - 1} style={{ marginLeft: 8 }}>⬇️ Baris Berikutnya</button>
        </div>
      </div>
      <div className="karaoke-lyrics-container">
        <div className="karaoke-lyrics-text">
          {lyricLines.map((line, idx) => (
            <div
              key={idx}
              id={`karaoke-line-${idx}`}
              className={idx === activeLine ? 'karaoke-line active' : 'karaoke-line'}
              style={{ padding: '8px 0', fontWeight: idx === activeLine ? 'bold' : 'normal', color: idx === activeLine ? '#ffeb3b' : undefined, fontSize: '2rem', transition: 'color 0.2s, font-weight 0.2s' }}
            >
              {line}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
