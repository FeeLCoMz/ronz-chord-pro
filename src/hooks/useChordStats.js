import { useEffect, useState } from 'react';
// Pastikan path import sesuai struktur project
import { parseChordPro, getAllChords } from '../utils/chordUtils.js';

/**
 * Custom hook untuk analisis chord dari lirik lagu
 * @param {string} lyrics - Lirik lagu
 * @returns {{ chords: string[], count: number }}
 */
export default function useChordStats(lyrics) {
  const [chordStats, setChordStats] = useState({ chords: [], count: 0 });

  useEffect(() => {
    if (!lyrics) {
      setChordStats({ chords: [], count: 0 });
      return;
    }
    try {
      const parsed = parseChordPro(lyrics);
      const chords = getAllChords(parsed);
      setChordStats({
        chords,
        count: chords.length,
      });
    } catch (err) {
      setChordStats({ chords: [], count: 0 });
    }
  }, [lyrics]);

  return chordStats;
}
