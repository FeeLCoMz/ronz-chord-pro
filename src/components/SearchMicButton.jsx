import React, { useRef } from 'react';

/**
 * Komponen SearchMicButton
 * Button mic untuk voice search, menggunakan Web Speech API (SpeechRecognition)
 * Props:
 *   onResult: function(keyword) dipanggil saat hasil pengenalan suara didapat
 */
export default function SearchMicButton({ onResult }) {
  const recognitionRef = useRef(null);
  const [listening, setListening] = React.useState(false);
  const [error, setError] = React.useState(null);

  const handleMicClick = () => {
    setError(null);
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      setError('Browser tidak mendukung voice search');
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = 'id-ID';
      recognitionRef.current.interimResults = false;
      recognitionRef.current.maxAlternatives = 1;
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setListening(false);
        if (onResult) onResult(transcript);
      };
      recognitionRef.current.onerror = (event) => {
        setListening(false);
        setError('Gagal mengenali suara');
      };
      recognitionRef.current.onend = () => {
        setListening(false);
      };
    }
    setListening(true);
    recognitionRef.current.start();
  };

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <button
        type="button"
        className="btn-base"
        aria-label="Cari dengan suara"
        onClick={handleMicClick}
        style={{ background: listening ? '#facc15' : undefined }}
        disabled={listening}
      >
        <span role="img" aria-label="mic">🎤</span>
        {listening ? 'Mendengarkan...' : 'Mic'}
      </button>
      {error && <span style={{ color: 'red', fontSize: '0.9em' }}>{error}</span>}
    </span>
  );
}
