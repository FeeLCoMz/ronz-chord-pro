import React, { useState, useMemo } from 'react';

const BulkAddSongsModal = ({ songs, currentSetList, onAddSongs, onAddNewSong, onCancel }) => {
  const [inputText, setInputText] = useState('');
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);

  // Parse input and search for songs
  const handleSearch = () => {
    const lines = inputText
      .split(/[\n,;|]/)
      .map(line => line.trim())
      .filter(line => line.length > 0);

    if (lines.length === 0) {
      setResults([]);
      setSearched(false);
      return;
    }

    const searchResults = lines.map(searchName => {
      const searchNameLower = searchName.toLowerCase();
      
      // Find song with better matching
      const found = songs.find(song => {
        if (!song || !song.name) return false;
        const songNameLower = song.name.toLowerCase();
        // Match if search name is part of song name or vice versa
        return songNameLower.includes(searchNameLower) || 
               searchNameLower.includes(songNameLower);
      });

      // Check if already in setlist
      let isInSetList = false;
      if (found && currentSetList?.songs) {
        isInSetList = currentSetList.songs.includes(found.id);
      }

      return {
        searchName,
        displayName: searchName.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        found: found || null,
        isInSetList
      };
    });

    setResults(searchResults);
    setSearched(true);
  };

  // Get songs to add (found and not in setlist)
  const songsToAdd = useMemo(() => {
    return results
      .filter(r => r.found && !r.isInSetList)
      .map(r => r.found.id)
      .filter(id => id); // Extra safety check
  }, [results]);

  // Get songs not found
  const songsNotFound = useMemo(() => {
    return results.filter(r => !r.found);
  }, [results]);

  // Get songs already in setlist
  const songsAlreadyInSetList = useMemo(() => {
    return results.filter(r => r.found && r.isInSetList);
  }, [results]);

  const handleAddSelected = () => {
    // Combine lagu yang ditemukan (ID) dan lagu yang tidak ditemukan (nama string)
    const songIdsToAdd = results
      .filter(r => r.found && !r.isInSetList)
      .map(r => r.found.id);
    
    const pendingSongNames = results
      .filter(r => !r.found)
      .map(r => r.searchName);

    if (songIdsToAdd.length === 0 && pendingSongNames.length === 0) {
      alert('Tidak ada lagu untuk ditambahkan');
      return;
    }

    // Kirim keduanya ke parent
    onAddSongs({ ids: songIdsToAdd, pendingNames: pendingSongNames });
    setInputText('');
    setResults([]);
    setSearched(false);
  };

  const handleAddNewSongClick = (songName) => {
    onAddNewSong(songName);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
        <button
          onClick={onCancel}
          className="btn-close"
          style={{ position: 'absolute', top: 18, right: 18, zIndex: 10 }}
          aria-label="Tutup"
        >
          ✕
        </button>
        
        <div className="modal-header">
          <h2 style={{ marginBottom: 0 }}>📝 Tambah Lagu ke Setlist</h2>
        </div>

        <div style={{ padding: '1.5rem' }}>
          {/* Input Section */}
          <div className="form-group">
            <label htmlFor="songList">
              Daftar Lagu (satu per baris atau pisahkan dengan koma)
            </label>
            <textarea
              id="songList"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Contoh:\nLagu Pertama\nLagu Kedua\nLagu Ketiga\n\nAtau: Lagu Satu, Lagu Dua, Lagu Tiga`}
              style={{
                width: '100%',
                minHeight: '150px',
                padding: '0.75rem',
                border: 'var(--border)',
                borderRadius: '0.375rem',
                fontFamily: 'inherit',
                fontSize: '0.95rem',
                resize: 'vertical',
                backgroundColor: 'var(--input-bg)',
                color: 'var(--text)',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <button
            onClick={handleSearch}
            className="btn btn-primary"
            style={{ width: '100%', marginBottom: '1.5rem' }}
            title="Cari lagu"
          >
            🔍 Cari Lagu
          </button>

          {/* Results Section */}
          {searched && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1rem' }}>
                Hasil Pencarian ({results.length})
              </h3>

              {results.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>
                  Tidak ada lagu ditemukan
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {results.map((result, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '1rem',
                        border: `2px solid ${result.found ? result.isInSetList ? '#f59e0b' : '#10b981' : '#ef4444'}`,
                        borderRadius: '0.375rem',
                        backgroundColor: 'var(--card-hover)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '1rem'
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>
                          {result.found ? (
                            <>
                              <span style={{ marginRight: '0.5rem' }}>
                                {result.isInSetList ? '⚠️' : '✓'}
                              </span>
                              {result.found.name}
                            </>
                          ) : (
                            <>
                              <span style={{ marginRight: '0.5rem' }}>⏳</span>
                              <span style={{ color: 'var(--text-secondary)' }}>{result.displayName}</span>
                            </>
                          )}
                        </div>
                        {result.found && result.isInSetList && (
                          <div style={{ fontSize: '0.85rem', color: '#f59e0b' }}>
                            Sudah ada di setlist
                          </div>
                        )}
                        {!result.found && (
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                            Akan disimpan sebagai pending - dapat dibuat nanti
                          </div>
                        )}
                      </div>
                      {!result.found && (
                        <button
                          onClick={() => handleAddNewSongClick(result.displayName)}
                          className="btn"
                          style={{
                            padding: '0.5rem 1rem',
                            fontSize: '0.875rem',
                            whiteSpace: 'nowrap',
                            flexShrink: 0
                          }}
                          title="Tambah lagu baru"
                        >
                          ➕ Tambah Baru
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Summary */}
              {results.length > 0 && (
                <div style={{
                  marginTop: '1rem',
                  padding: '1rem',
                  backgroundColor: 'var(--bg-elevated)',
                  borderRadius: '0.375rem',
                  fontSize: '0.9rem',
                  borderLeft: `4px solid var(--primary)`
                }}>
                  <div>✓ Ditemukan & bisa ditambah: <strong>{songsToAdd.length}</strong></div>
                  <div>⚠️ Sudah ada di setlist: <strong>{songsAlreadyInSetList.length}</strong></div>
                  <div>⏳ Menunggu ditambah (pending): <strong>{songsNotFound.length}</strong></div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
            {searched && (songsToAdd.length > 0 || songsNotFound.length > 0) && (
              <button
                onClick={handleAddSelected}
                className="btn btn-primary"
                style={{ flex: 1 }}
                title={`Tambah ${songsToAdd.length + songsNotFound.length} lagu (${songsToAdd.length} ditemukan + ${songsNotFound.length} pending)`}
              >
                ✓ Tambah {songsToAdd.length + songsNotFound.length} Lagu
              </button>
            )}
            <button
              onClick={onCancel}
              className="btn"
              style={{ flex: 1 }}
              title="Batal"
            >
              ✕ Batal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkAddSongsModal;
