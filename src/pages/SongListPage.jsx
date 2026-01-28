
import React, { useRef } from 'react';
import SongList from '../components/SongList.jsx';
import PlusIcon from '../components/PlusIcon.jsx';

export default function SongListPage({ songs, loading, error, search, setSearch, onSongClick }) {
  const recognitionRef = useRef(null);
  const isSpeechSupported = typeof window !== 'undefined' && (
    window.SpeechRecognition || window.webkitSpeechRecognition
  );

  const handleVoiceSearch = () => {
    if (!isSpeechSupported) {
      alert('Fitur pencarian suara tidak didukung di browser Anda.');
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
        setSearch(transcript);
      };
      recognitionRef.current.onerror = (event) => {
        alert('Terjadi kesalahan saat mengenali suara: ' + event.error);
      };
    }
    recognitionRef.current.start();
  };
  return (
    <>
      <div className="section-title">Lagu</div>
      <div className="info-text">
        {songs.length} Lagu
      </div>
      <button className="btn-base tab-btn add-song-btn" onClick={() => onSongClick('add')} title="Tambah Lagu" aria-label="Tambah Lagu">
        <PlusIcon size={22} />
      </button>
      <div className="song-search-bar">
        <input
          type="text"
          placeholder="Cari judul atau artist..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="search-input"
        />
        <button
          type="button"
          className="btn-base tab-btn mic-btn"
          title="Cari dengan suara"
          onClick={handleVoiceSearch}
        >
          <span role="img" aria-label="Mic">🎤</span>
        </button>
      </div>
      {loading && <div className="info-text">Memuat daftar lagu...</div>}
      {error && <div className="error-text">{error}</div>}
      <SongList
        songs={songs}
        onSongClick={onSongClick}
        emptyText="Tidak ada lagu ditemukan."
      />
    </>
  );
}
