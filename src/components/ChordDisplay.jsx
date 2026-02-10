
import React from 'react';
import NumberToken from './NumberToken.jsx';
import { transposeChord, parseChordLine, parseSection, parseNumberLine, isChordLine } from '../utils/chordUtils.js';

/**
 * Komponen ChordDisplay
 * Menampilkan lirik lagu beserta notasi chord, angka, dan struktur bagian lagu.
 * Mendukung transposisi chord dan zoom tampilan.
 *
 * Props:
 * @param {Object} song - Objek lagu, harus memiliki properti 'lyrics' (string)
 * @param {number} [transpose=0] - Jumlah transposisi chord (positif/negatif)
 * @param {number} [zoom=1] - Skala zoom tampilan (1 = normal)
 *
 * Fitur:
 * - Parsing baris lirik menjadi struktur: kosong, struktur, instrumen, chord, angka, lirik
 * - Chord dan angka ditampilkan dengan token khusus
 * - Mendukung transposisi chord secara otomatis
 * - Layout responsif dengan CSS class standar
 */

/**
 * Mem-parse array baris lirik menjadi struktur token untuk rendering.
 * @param {string[]} lines - Array baris lirik
 * @param {number} transpose - Jumlah transposisi chord
 * @returns {Array} Array objek baris terstruktur
 */
function parseLines(lines, transpose) {
  return lines.map(line => {
    const trimmed = line.trim();
    if (trimmed === '') return { type: 'empty' };
    // Cek apakah baris adalah section (struktur lagu atau instrumen)
    const section = parseSection(line);
    if (section) return { type: section.type, label: section.label };
    // Baris chord penuh (gunakan isChordLine agar mendukung format gabungan - dan ..)
    if (isChordLine(line)) {
      // Transpose semua token chord di baris
      const tokens = line.split(/(\s+)/).map(token => {
        if (/^\s+$/.test(token)) return { token, isSpace: true };
        return { token: transpose ? transposeChord(token, transpose) : token, isChord: true };
      });
      return { type: 'chord', tokens };
    }
    // Baris angka penuh
    if (parseNumberLine(line)) {
      const tokens = line.split(/(\s+)/).map(token => {
        if (/^\s+$/.test(token)) return { token, isSpace: true };
        return { token, isNumber: true };
      });
      return { type: 'number', tokens };
    }
    // Baris lirik, tokenisasi inline chord/angka
    const tokens = line.split(/(\s+)/).map(token => {
      const t = token.trim();
      if (/^\s+$/.test(token)) return { token, isSpace: true };
      if (parseChordLine(t)) return { token: transpose ? transposeChord(t, transpose) : t, isChord: true };
      if (parseNumberLine(t)) return { token, isNumber: true };
      return { token };
    });
    return { type: 'lyrics', tokens };
  });
}

export default function ChordDisplay({ song, transpose = 0, zoom = 1 }) {
  // Jika tidak ada lirik, tampilkan pesan kosong
  if (!song?.lyrics) {
    return (
      <div className="cd-empty">
        No lyrics available
      </div>
    );
  }

  // Pisahkan lirik menjadi baris, lalu parse
  const lines = song.lyrics.split(/\r?\n/);
  const parsedLines = parseLines(lines, transpose);

  // Render setiap baris sesuai tipenya
  return (
    <div className="cd" style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}>
      {parsedLines.map((lineObj, i) => {
        switch (lineObj.type) {
          case 'empty':
            // Baris kosong
            return <div key={i} className="cd-empty-line">&nbsp;</div>;
          case 'structure':
            // Struktur lagu: tampilkan label dengan kapitalisasi asli
            return <div key={i} className="cd-section-struct">{lineObj.label}</div>;
          case 'instrument':
            // Instrumen: tampilkan label dengan kapitalisasi asli
            return <div key={i} className="cd-section-inst">{lineObj.label}</div>;
          case 'chord':
            // Baris chord: setiap token chord diberi class khusus
            return (
              <div key={i} className="cd-chord">
                {lineObj.tokens.map((t, j) =>
                  t.isSpace ? <span key={j}>{t.token}</span> :
                  <span key={j} className="cd-token">{t.token}</span>
                )}
              </div>
            );
          case 'number':
            // Baris angka: gunakan komponen NumberToken
            return (
              <div key={i} className="cd-number">
                {lineObj.tokens.map((t, j) =>
                  t.isSpace ? <span key={j}>{t.token}</span> : <NumberToken key={j} number={t.token} />
                )}
              </div>
            );
          case 'lyrics':
            // Baris lirik: tokenisasi inline
            return (
              <div key={i} className="cd-lyrics">
                {lineObj.tokens.map((t, j) => (
                  <span key={j}>{t.token}</span>
                ))}
              </div>
            );
          default:
            // Fallback: render token apa adanya
            return <div key={i}>{lineObj.tokens.map((t, j) => <span key={j}>{t.token}</span>)}</div>;
        }
      })}
    </div>
  );
}