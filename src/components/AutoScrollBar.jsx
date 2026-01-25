import React, { useRef, useEffect, useState } from 'react';

// Auto scroll bar + tempo/metronome indicator for performance mode
export default function AutoScrollBar({ tempo = 80, onScrollChange }) {
  const [scrolling, setScrolling] = useState(false);
  const [speed, setSpeed] = useState(tempo); // BPM
  const intervalRef = useRef(null);
  const [beat, setBeat] = useState(0);

  useEffect(() => {
    if (scrolling) {
      intervalRef.current = setInterval(() => {
        setBeat(b => (b + 1) % 4);
        window.scrollBy({ top: speed / 2, behavior: 'smooth' });
        if (onScrollChange) onScrollChange(speed);
      }, 60000 / speed);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [scrolling, speed, onScrollChange]);

  return (
    <div className="auto-scroll-bar">
      <button
        className={scrolling ? 'auto-scroll-btn active' : 'auto-scroll-btn'}
        onClick={() => setScrolling(s => !s)}
      >{scrolling ? '⏸️ Stop Scroll' : '▶️ Auto Scroll'}</button>
      <label className="tempo-label">
        Tempo/BPM:
        <input
          type="number"
          min={40}
          max={240}
          value={speed}
          onChange={e => setSpeed(Number(e.target.value))}
          className="tempo-input"
        />
      </label>
      <div className="metronome-indicator">
        {[0, 1, 2, 3].map(i => (
          <span
            key={i}
            className={beat === i ? 'metronome-dot active' : 'metronome-dot'}
          >●</span>
        ))}
      </div>
    </div>
  );
}
