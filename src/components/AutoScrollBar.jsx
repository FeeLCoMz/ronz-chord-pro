import React, { useRef, useEffect, useState } from 'react';

/**
 * AutoScrollBar - Kontrol auto scroll dengan beat indicator
 * 
 * Props:
 * - tempo: number (BPM default, default 80)
 * - onScrollChange: function (callback ketika scroll speed berubah, optional)
 */
export default function AutoScrollBar({ tempo = 120, onScrollChange, lyricsDisplayRef }) {
  const [scrolling, setScrolling] = useState(false);
  const [speed, setSpeed] = useState(tempo);
  const [beat, setBeat] = useState(0);
  const frameRef = useRef(null);
  const beatTimeRef = useRef(null);
  const barBeatRef = useRef(0);

  // Sync speed with tempo prop
  useEffect(() => {
    setSpeed(tempo);
  }, [tempo]);

  useEffect(() => {
    if (scrolling) {
      beatTimeRef.current = performance.now();
      barBeatRef.current = 0;

      const scrollStep = () => {
        const now = performance.now();

        // Metronome beat
        if (now - beatTimeRef.current > 60000 / speed) {
          setBeat(b => (b + 1) % 4);
          beatTimeRef.current = now;
          barBeatRef.current += 1;

          if (barBeatRef.current >= 4) {
            // Scroll the lyrics display element if ref is provided
            if (lyricsDisplayRef && lyricsDisplayRef.current) {
              lyricsDisplayRef.current.scrollBy({ top: 50, behavior: 'smooth' });
            }
            barBeatRef.current = 0;
          }
        }

        if (onScrollChange) onScrollChange(speed);
        frameRef.current = requestAnimationFrame(scrollStep);
      };

      frameRef.current = requestAnimationFrame(scrollStep);
    } else {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    }

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [scrolling, speed, onScrollChange, lyricsDisplayRef]);

  return (
    <div className="auto-scroll-bar">
      {/* Controls Row */}
      <div className="auto-scroll-controls">
        <button
          className={`auto-scroll-toggle ${scrolling ? 'active' : ''}`}
          onClick={() => setScrolling(s => !s)}
          title={scrolling ? 'Stop auto scroll' : 'Start auto scroll'}
        >
          <span className="auto-scroll-icon">
            {scrolling ? '⏸️' : '▶️'}
          </span>
          <span className="auto-scroll-text">
            {scrolling ? 'Scrolling' : 'Autoscroll'}
          </span>
        </button>
        
        <div className="auto-scroll-tempo">
          <label className="auto-scroll-tempo-label">
            <span className="auto-scroll-tempo-icon">⏱️</span>
            <span className="auto-scroll-tempo-text">BPM</span>
          </label>
          <input
            type="number"
            min={40}
            max={240}
            value={speed}
            onChange={e => setSpeed(Number(e.target.value))}
            disabled={scrolling}
            className="auto-scroll-tempo-input"
            title={scrolling ? 'Stop auto scroll untuk mengubah tempo' : 'Atur tempo scroll'}
          />
        </div>
      </div>
      
      {/* Beat Indicator - hanya tampil saat scrolling */}
      {scrolling && (
        <div className="auto-scroll-beats">
          <span className="auto-scroll-beats-label">Beat:</span>
          <div className="auto-scroll-beat-dots">
            {[0, 1, 2, 3].map(i => (
              <span
                key={i}
                className={`beat-dot ${beat === i ? 'active' : ''}`}
                aria-label={`Beat ${i + 1}${beat === i ? ' (current)' : ''}`}
              >
                ●
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
