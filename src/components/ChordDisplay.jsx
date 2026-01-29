import React from 'react';
import { transposeChord as transposeChordUtil, getNoteIndex } from '../utils/chordUtils.js';

// Regex chord mirip dengan chordUtils.js (tanpa global flag)
const CHORD_REGEX = /-?[A-G][#b]?(maj7|maj9|min7|min9|m|maj|min|dim|aug|sus2|sus4|sus|add9|add)?[0-9]*(\/[A-G][#b]?)?(\.+)?/;

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

// Gunakan transposeChord dari chordUtils agar konsisten
function transposeChord(chord, amount) {
  return transposeChordUtil(chord, amount);
}

function parseSection(line) {
  // Gabungkan deteksi [Section], Section:, [Instrumen], Instrumen: dengan satu regex
  // Contoh cocok: [Intro], Intro:, [Gitar], Gitar:
  const match = line.trim().match(/^(?:\[)?([A-Za-z0-9 .:_-]+?)(?:\])?\s*:?\s*$/);
  if (match) {
    const label = match[1].toLowerCase();
    // Daftar kata kunci struktur lagu
    const structureKeywords = ['intro', 'verse', 'chorus', 'bridge', 'outro', 'interlude', 'reff', 'pre-chorus'];
    // Daftar kata kunci instrumen umum per kategori
    const instrumentKeywords = [
      // Gitar dan keluarga
      'gitar', 'guitar', 'bass', 'ukulele', 'mandolin',
      // Keyboard
      'piano', 'keyboard', 'organ', 'synth',
      // Tiup
      'saxophone', 'saksofon', 'saxofon','trumpet', 'terompet', 'flute', 'suling', 'clarinet', 'klarinet',
      // Gesek
      'violin', 'biola', 'cello', 'kontrabas', 'strings',
      // Vokal
      'vokal', 'vocal', 'vocalist', 'vokalist', 'choir', 'vokal grup',
      // Perkusi/Drum
      'drum', 'drums', 'perkusi', 'percussion', 'cajon', 'tamborin', 'marakas', 'rebana'
    ];
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


  // Regex untuk not angka dan bar
  const numberNoteRegex = /\b[1-7](?:[.']*)\b/g;
  // urutan penting: double bar, repeat, single bar
  const barRegex = /\|\:|\:\||\[\:|\:\]|\|\||\|/g;
  // Gabungkan regex untuk split (not angka, bar, dan sisanya)
  const splitRegex = /(\|\:|\:\||\[\:|\:\]|\|\||\||\b[1-7](?:[.']*)\b)/g;

  // Fungsi render line dengan highlight not angka, bar, dan chord di antara bar
  function renderLyricsLine(line, key) {
    const tokens = line.split(splitRegex).filter(Boolean);
    let lastWasBar = false;
    return (
      <span key={key} className="lyrics-line">
        {tokens.map((token, idx) => {
          // Not angka
          if (numberNoteRegex.test(token)) {
            lastWasBar = false;
            return <span key={idx} className="not-angka-highlight">{token}</span>;
          }
          // Bar
          if (barRegex.test(token)) {
            lastWasBar = true;
            let barClass = 'bar-highlight';
            if (token === '||') barClass += ' double-bar';
            if (token === '|:' || token === ':|' || token === '[:' || token === ':]') barClass += ' repeat-bar';
            return <span key={idx} className={barClass}>{token}</span>;
          }
          // Chord di antara bar
          if (CHORD_REGEX.test(token.trim())) {
            // Cek jika token diapit bar (| C |), atau setelah bar
            // (tidak harus, highlight semua chord di line non-chord)
            let chord = transpose ? transposeChord(token.trim(), transpose) : token.trim();
            lastWasBar = false;
            return <span key={idx} className="chord-highlight">{chord}</span>;
          }
          lastWasBar = false;
          return token;
        })}
      </span>
    );
  }

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
            // Render lirik dengan highlight not angka & bar
            return renderLyricsLine(line, i);
          }
        })}
      </pre>
    </div>
  );
}