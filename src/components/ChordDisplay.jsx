import React from 'react';

/**
 * Komponen untuk menampilkan lirik dan chord lagu.
 * Props:
 * - song: objek lagu, harus punya property 'lyrics' (string, bisa mengandung baris chord)
 * - transpose: integer (default 0), untuk transpose chord
 * - highlightChords: boolean, jika true chord akan di-highlight
 */
function parseChordLine(line) {
  const chordRegex = /^[A-G][#b]?m?(aj|sus|dim|aug|add)?\d*(\/([A-G][#b]?))?$/i;
  const words = line.trim().split(/\s+/);
  if (!words.length) return false;
  const chordCount = words.filter(w => chordRegex.test(w)).length;
  return chordCount > 0 && chordCount >= words.length / 2;
}

function transposeChord(chord, amount) {
  const notes = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
  const flatNotes = ['C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B'];
  let match = chord.match(/^([A-G])([#b]?)(.*)$/);
  if (!match) return chord;
  let [_, root, accidental, rest] = match;
  let idx = notes.indexOf(root + (accidental === '#' ? '#' : ''));
  if (idx === -1 && accidental === 'b') idx = flatNotes.indexOf(root + 'b');
  if (idx === -1) return chord;
  let newIdx = (idx + amount + 12) % 12;
  let newRoot = notes[newIdx];
  return newRoot + rest;
}

function parseSection(line) {
  // Gabungkan deteksi [Section], Section:, [Instrumen], Instrumen: dengan satu regex
  // Contoh cocok: [Intro], Intro:, [Gitar], Gitar:
  const match = line.trim().match(/^(?:\[)?([A-Za-z0-9 .:_-]+?)(?:\])?\s*:?\s*$/);
  if (match) {
    const label = match[1].toLowerCase();
    // Daftar kata kunci struktur lagu
    const structureKeywords = ['intro', 'verse', 'chorus', 'bridge', 'outro', 'interlude', 'reff', 'pre-chorus'];
    // Daftar kata kunci instrumen
    const instrumentKeywords = ['guitar', 'gitar', 'piano', 'bass', 'keyboard', 'drum'];
    if (structureKeywords.some(k => label.includes(k))) {
      return { type: 'structure', label };
    }
    if (instrumentKeywords.some(k => label.includes(k))) {
      return { type: 'instrument', label };
    }
  }
  return null;
}

export default function ChordDisplay({ song, transpose = 0, highlightChords = false }) {
  if (!song || !song.lyrics) return <div>Tidak ada lirik</div>;
  const lines = song.lyrics.split(/\r?\n/);
  return (
    <div className="chord-display">
      <pre>
        {lines.map((line, i) => {
          const section = parseSection(line);
          if (section) {
            if (section.type === 'structure') {
              return (
                <span key={i} className="structure-marker">
                  <span className="structure-label">{section.label}</span>
                </span>
              );
            }
            if (section.type === 'instrument') {
              return (
                <span key={i} className="instrument-highlight">
                  {section.label}
                </span>
              );
            }
          }
          if (parseChordLine(line)) {
            // Render chord line per karakter agar spasi tetap
            return (
              <span key={i} className="chord-line" style={{whiteSpace: 'pre'}}>
                {line.split(/(\s+)/).map((token, j) => {
                  // token bisa berupa chord atau spasi
                  if (/^\s+$/.test(token)) return token;
                  let chord = transpose ? transposeChord(token, transpose) : token;
                  return highlightChords ? <span key={j} className="chord-highlight">{chord}</span> : chord;
                })}
              </span>
            );
          } else {
            return <span key={i} className="lyrics-line">{line}</span>;
          }
        })}
      </pre>
    </div>
  );
}