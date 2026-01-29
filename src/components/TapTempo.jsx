import React, { useRef, useState } from 'react';

// Komponen TapTempo: klik/tap berulang untuk dapatkan BPM
export default function TapTempo({ onTempo, initialTempo = '', disabled = false }) {
  const [bpm, setBpm] = useState(initialTempo || '');
  const [taps, setTaps] = useState([]);
  const timeoutRef = useRef();

  function handleTap() {
    const now = Date.now();
    let newTaps = [...taps, now];
    // Hanya simpan 8 tap terakhir
    if (newTaps.length > 8) newTaps = newTaps.slice(-8);
    setTaps(newTaps);
    if (newTaps.length > 1) {
      const intervals = newTaps.slice(1).map((t, i) => t - newTaps[i]);
      const avgMs = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const bpmVal = Math.round(60000 / avgMs);
      setBpm(bpmVal);
      if (onTempo) onTempo(bpmVal);
    }
    // Reset tap jika tidak tap lagi dalam 2.5 detik
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setTaps([]), 2500);
  }

  function handleInput(e) {
    setBpm(e.target.value);
    if (onTempo) onTempo(e.target.value);
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
      <button type="button" onClick={handleTap} disabled={disabled} style={{ fontWeight: 600, fontSize: 16, padding: '6px 14px', borderRadius: 6, background: '#23243a', color: '#facc15', border: '1.5px solid #35376a', cursor: 'pointer' }}>
        Tap Tempo
      </button>
      <input
        type="number"
        min="30"
        max="300"
        value={bpm}
        onChange={handleInput}
        placeholder="BPM"
        style={{ width: 60, fontWeight: 600, fontSize: 15, borderRadius: 5, border: '1.2px solid #35376a', background: '#18192b', color: '#facc15', padding: '4px 6px' }}
        disabled={disabled}
      />
      <span style={{ color: '#aaa', fontSize: 13 }}>BPM</span>
    </div>
  );
}
