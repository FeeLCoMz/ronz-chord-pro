import React, { useState } from 'react';

// Comprehensive chord fingering database
const CHORD_DATABASE = {
  'C': [
    { name: 'C (Open)', frets: [0, 3, 2, 0, 1, 0], fingers: [0, 3, 2, 0, 1, 0], difficulty: 'beginner' },
    { name: 'C (Barre)', frets: [8, 10, 10, 9, 8, 8], fingers: [1, 3, 4, 2, 1, 1], difficulty: 'intermediate' }
  ],
  'Cm': [
    { name: 'Cm', frets: [8, 10, 10, 8, 8, 8], fingers: [1, 3, 4, 1, 1, 1], difficulty: 'intermediate' }
  ],
  'C7': [
    { name: 'C7', frets: [0, 3, 2, 3, 1, 0], fingers: [0, 3, 2, 4, 1, 0], difficulty: 'beginner' }
  ],
  'D': [
    { name: 'D (Open)', frets: [2, 3, 2, 0, -1, 0], fingers: [1, 2, 1, 0, -1, 0], difficulty: 'beginner' },
    { name: 'D (Barre)', frets: [10, 12, 12, 11, 10, 10], fingers: [1, 3, 4, 2, 1, 1], difficulty: 'intermediate' }
  ],
  'Dm': [
    { name: 'Dm (Open)', frets: [1, 3, 2, 0, 1, 0], fingers: [1, 3, 2, 0, 1, 0], difficulty: 'beginner' }
  ],
  'D7': [
    { name: 'D7', frets: [2, 3, 2, 2, -1, 0], fingers: [1, 2, 1, 1, -1, 0], difficulty: 'beginner' }
  ],
  'E': [
    { name: 'E (Open)', frets: [0, 2, 2, 1, 0, 0], fingers: [0, 2, 3, 1, 0, 0], difficulty: 'beginner' },
    { name: 'E (Barre)', frets: [12, 14, 14, 13, 12, 12], fingers: [1, 3, 4, 2, 1, 1], difficulty: 'intermediate' }
  ],
  'Em': [
    { name: 'Em (Open)', frets: [0, 2, 2, 0, 1, 0], fingers: [0, 2, 3, 0, 1, 0], difficulty: 'beginner' }
  ],
  'E7': [
    { name: 'E7', frets: [0, 2, 2, 1, 2, 0], fingers: [0, 2, 3, 1, 2, 0], difficulty: 'beginner' }
  ],
  'F': [
    { name: 'F (Barre)', frets: [1, 3, 3, 2, 1, 1], fingers: [1, 3, 4, 2, 1, 1], difficulty: 'intermediate' },
    { name: 'F (Easy)', frets: [1, 1, 2, 3, 3, 1], fingers: [1, 1, 2, 3, 4, 1], difficulty: 'beginner' }
  ],
  'Fm': [
    { name: 'Fm', frets: [1, 3, 3, 1, 1, 1], fingers: [1, 3, 4, 1, 1, 1], difficulty: 'intermediate' }
  ],
  'G': [
    { name: 'G (Open)', frets: [3, 2, 0, 0, 0, 3], fingers: [2, 1, 0, 0, 0, 3], difficulty: 'beginner' },
    { name: 'G (Barre)', frets: [10, 12, 12, 11, 10, 10], fingers: [1, 3, 4, 2, 1, 1], difficulty: 'intermediate' }
  ],
  'Gm': [
    { name: 'Gm', frets: [3, 5, 5, 3, 3, 3], fingers: [1, 3, 4, 1, 1, 1], difficulty: 'intermediate' }
  ],
  'G7': [
    { name: 'G7', frets: [3, 2, 0, 0, 0, 1], fingers: [3, 2, 0, 0, 0, 1], difficulty: 'beginner' }
  ],
  'A': [
    { name: 'A (Open)', frets: [0, 0, 2, 2, 2, 0], fingers: [0, 0, 1, 2, 3, 0], difficulty: 'beginner' },
    { name: 'A (Barre)', frets: [5, 7, 7, 6, 5, 5], fingers: [1, 3, 4, 2, 1, 1], difficulty: 'intermediate' }
  ],
  'Am': [
    { name: 'Am (Open)', frets: [0, 0, 2, 2, 1, 0], fingers: [0, 0, 2, 3, 1, 0], difficulty: 'beginner' }
  ],
  'A7': [
    { name: 'A7', frets: [0, 0, 2, 0, 2, 0], fingers: [0, 0, 1, 0, 2, 0], difficulty: 'beginner' }
  ],
  'B': [
    { name: 'B (Barre)', frets: [2, 4, 4, 3, 2, 2], fingers: [1, 3, 4, 2, 1, 1], difficulty: 'intermediate' },
    { name: 'B (Easy)', frets: [2, 2, 4, 4, 4, 2], fingers: [1, 1, 3, 4, 4, 1], difficulty: 'beginner' }
  ],
  'Bm': [
    { name: 'Bm', frets: [2, 3, 4, 4, 3, 2], fingers: [1, 2, 4, 3, 2, 1], difficulty: 'intermediate' }
  ],
  'B7': [
    { name: 'B7', frets: [2, 4, 4, 3, 4, 2], fingers: [1, 3, 4, 2, 4, 1], difficulty: 'intermediate' }
  ]
};

// Finger position labels
const FINGER_NAMES = {
  0: 'Open',
  1: 'Index',
  2: 'Middle',
  3: 'Ring',
  4: 'Pinky'
};

export default function ChordDiagramModal({ chordName, onClose }) {
  const [selectedVoicing, setSelectedVoicing] = useState(0);
  
  // Normalize chord name (remove anything after first space/modifier)
  const baseChord = chordName.split(/[\s\/]/)[0].toUpperCase();
  const chords = CHORD_DATABASE[baseChord] || [];

  if (chords.length === 0) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content chord-diagram-modal" onClick={(e) => e.stopPropagation()}>
          <button className="btn-close" onClick={onClose}>✕</button>
          <div className="modal-header">
            <h2>🎸 Chord Diagram - {chordName}</h2>
          </div>
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <p>Diagram untuk chord "{chordName}" belum tersedia.</p>
            <p style={{ fontSize: '0.9rem' }}>Coba gunakan chord yang lebih umum seperti C, D, E, G, A, dll.</p>
          </div>
        </div>
      </div>
    );
  }

  const chord = chords[selectedVoicing];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content chord-diagram-modal" onClick={(e) => e.stopPropagation()}>
        <button className="btn-close" onClick={onClose}>✕</button>
        <div className="modal-header">
          <h2>🎸 Chord Diagram - {chordName}</h2>
        </div>
        
        <div style={{ padding: '2rem' }}>
          {/* Chord selection tabs */}
          {chords.length > 1 && (
            <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {chords.map((c, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedVoicing(idx)}
                  className={`btn btn-sm ${selectedVoicing === idx ? 'btn-primary' : ''}`}
                  title={`${c.name} (${c.difficulty})`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          )}

          {/* Fretboard Diagram */}
          <div style={{ marginBottom: '2rem' }}>
            <Fretboard chord={chord} />
          </div>

          {/* Fingering Instructions */}
          <div style={{ 
            background: 'var(--card-hover)', 
            padding: '1rem', 
            borderRadius: '8px',
            marginBottom: '1rem'
          }}>
            <h4 style={{ margin: '0 0 0.5rem 0' }}>Fingering Instructions:</h4>
            <FingeringList chord={chord} />
          </div>

          {/* Difficulty Level */}
          <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Difficulty: <span style={{ 
              color: chord.difficulty === 'beginner' ? 'var(--success)' : 'var(--warning)',
              fontWeight: 'bold'
            }}>
              {chord.difficulty.charAt(0).toUpperCase() + chord.difficulty.slice(1)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Fretboard({ chord }) {
  const FRETS = 5;
  const STRINGS = 6;
  const STRING_NAMES = ['E', 'A', 'D', 'G', 'B', 'E'];
  
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        {/* String names at top */}
        <div style={{ display: 'flex', marginBottom: '0.5rem', marginLeft: '2rem' }}>
          {STRING_NAMES.map((name, i) => (
            <div key={i} style={{ width: '50px', textAlign: 'center', fontWeight: 'bold', fontSize: '0.9rem' }}>
              {name}
            </div>
          ))}
        </div>

        {/* Fretboard */}
        <div style={{ border: '3px solid var(--border-light)', borderRadius: '4px', overflow: 'hidden', display: 'inline-block' }}>
          {/* Nut/First fret line */}
          <div style={{ 
            display: 'flex',
            borderBottom: '4px solid var(--text)',
            backgroundColor: 'var(--bg-elevated)',
            height: '40px',
            alignItems: 'center'
          }}>
            {chord.frets.map((fret, stringIdx) => (
              <div
                key={stringIdx}
                style={{
                  width: '50px',
                  height: '100%',
                  borderRight: stringIdx < 5 ? `2px solid var(--border-light)` : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}
              >
                {fret === 0 && <div style={{ fontSize: '1.5rem', color: 'var(--text-muted)' }}>○</div>}
                {fret > 0 && (
                  <div style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '0.9rem'
                  }}>
                    {chord.fingers[stringIdx]}
                  </div>
                )}
                {fret === -1 && <div style={{ fontSize: '1.5rem', color: 'var(--text-muted)' }}>✕</div>}
              </div>
            ))}
          </div>

          {/* Frets 1-5 */}
          {[...Array(FRETS)].map((_, fretIdx) => (
            <div
              key={fretIdx}
              style={{
                display: 'flex',
                borderBottom: fretIdx < FRETS - 1 ? `1px solid var(--border-light)` : 'none',
                backgroundColor: 'var(--bg-elevated)',
                height: '60px',
                alignItems: 'center'
              }}
            >
              {chord.frets.map((openFret, stringIdx) => (
                <div
                  key={stringIdx}
                  style={{
                    width: '50px',
                    height: '100%',
                    borderRight: stringIdx < 5 ? `2px solid var(--border-light)` : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative'
                  }}
                >
                  {openFret === fretIdx + 1 && (
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      boxShadow: '0 2px 8px rgba(99, 102, 241, 0.4)'
                    }}>
                      {chord.fingers[stringIdx]}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Fret numbers on left */}
        <div style={{ marginTop: '0.25rem', display: 'flex', flexDirection: 'column', width: '30px', gap: '48px', paddingTop: '40px' }}>
          {[...Array(FRETS)].map((_, i) => (
            <div key={i} style={{ fontSize: '0.8rem', color: 'var(--text-muted)', height: '60px', display: 'flex', alignItems: 'center' }}>
              {i + 1}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', justifyContent: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <div>○ = Open string</div>
          <div>✕ = Muted/Not played</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'var(--primary)' }}></div>
            = Fretted
          </div>
        </div>
      </div>
    </div>
  );
}

function FingeringList({ chord }) {
  const STRING_NAMES = ['6th (Low E)', '5th (A)', '4th (D)', '3rd (G)', '2nd (B)', '1st (High E)'];

  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      {chord.frets.map((fret, idx) => {
        let instruction = '';
        if (fret === 0) {
          instruction = 'Open string';
        } else if (fret === -1) {
          instruction = 'Muted/not played';
        } else {
          const finger = chord.fingers[idx];
          instruction = `${FINGER_NAMES[finger]} finger on fret ${fret}`;
        }

        return (
          <li key={idx} style={{ padding: '0.3rem 0', fontSize: '0.9rem' }}>
            <strong>{STRING_NAMES[idx]}:</strong> {instruction}
          </li>
        );
      })}
    </ul>
  );
}
