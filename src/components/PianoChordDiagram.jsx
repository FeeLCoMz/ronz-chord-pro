import React from 'react';
import PropTypes from 'prop-types';
import { playNote } from '../utils/audio';

// Piano key mapping for 1 octave (C to B)
const WHITE_KEYS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const BLACK_KEYS = ['C#', 'D#', '', 'F#', 'G#', 'A#', ''];

function getKeyIndex(note) {
  // Accepts C, C#, D, D#, ...
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  return notes.indexOf(note);
}

function parseChordRoot(chord) {
  // Extract root note (C, D#, F, etc.) from chord string
  const match = chord.match(/^[A-G](#|b)?/);
  return match ? match[0].replace('b', '#') : null;
}

const PianoChordDiagram = ({ chord }) => {
  // Only show 1 octave for simplicity, highlight root and triad
  const root = parseChordRoot(chord);
  if (!root) return <div className="piano-diagram">?</div>;

  // For now, highlight root only (expandable for full chord voicing)
  const keys = Array(12).fill(false);
  const rootIdx = getKeyIndex(root);
  if (rootIdx !== -1) keys[rootIdx] = true;

  const defaultOctave = 4;

  return (
    <div className="piano-diagram">
      <div className="white-keys">
        {WHITE_KEYS.map((note, i) => {
          const idx = getKeyIndex(note);
          return (
            <div
              key={note}
              className={
                'white-key' + (keys[idx] ? ' active' : '')
              }
              onClick={() => playNote(note, { octave: defaultOctave })}
            >
              {note}
            </div>
          );
        })}
      </div>
      <div className="black-keys">
        {BLACK_KEYS.map((note, i) => {
          if (!note) return <div key={i} className="black-key empty" />;
          const idx = getKeyIndex(note);
          return (
            <div
              key={note}
              className={
                'black-key' + (keys[idx] ? ' active' : '')
              }
              onClick={() => playNote(note, { octave: defaultOctave })}
            >
              {note}
            </div>
          );
        })}
      </div>
    </div>
  );
};

PianoChordDiagram.propTypes = {
  chord: PropTypes.string.isRequired,
};

export default PianoChordDiagram;
