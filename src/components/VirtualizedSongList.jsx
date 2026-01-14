import React from 'react';
import { List } from 'react-window';
import SongListItem from './SongListItem';

/**
 * VirtualizedSongList - High-performance song list using react-window
 * 
 * Virtualization means only visible items are rendered in the DOM,
 * enabling smooth scrolling with 1000+ songs.
 * 
 * @param {Array} songs - Array of song objects to display
 * @param {string} selectedSongId - ID of currently selected song
 * @param {function} onSelectSong - Callback when song is selected
 * @param {function} onEditSong - Callback to edit song
 * @param {function} onDeleteSong - Callback to delete song
 * @param {Array} setLists - Available setlists
 * @param {function} onAddToSetLists - Add song to setlists
 * @param {function} onRemoveFromSetList - Remove song from setlist
 * @param {string} currentSetList - Currently active setlist ID
 * @param {Object} songKeys - Override keys per setlist
 * @param {function} onSetListKeyChange - Callback for key changes
 * @param {string} viewMode - Current view mode (default, lyrics, etc)
 * @param {Object} completedSongs - Object mapping song IDs to completion status
 * @param {function} onToggleCompleted - Callback to toggle song completion
 */
export default function VirtualizedSongList({
  songs = [],
  selectedSongId,
  onSelectSong,
  onEditSong,
  onDeleteSong,
  setLists = [],
  onAddToSetLists,
  onRemoveFromSetList,
  currentSetList,
  songKeys = {},
  onSetListKeyChange,
  viewMode = 'default',
  completedSongs = {},
  onToggleCompleted = null
}) {
  // Calculate dynamic item height based on view mode
  const getItemHeight = () => {
    switch (viewMode) {
      case 'lyrics':
        return 140; // Taller for lyrics display
      case 'compact':
        return 70; // Shorter for minimal view
      default:
        return 110; // Standard height
    }
  };

  const ITEM_HEIGHT = getItemHeight();

  // Calculate available height - viewport height minus header/nav/padding
  const listHeight = Math.max(300, window.innerHeight - 320);

  // Empty state
  if (!songs || songs.length === 0) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        <p>Tidak ada lagu untuk ditampilkan</p>
      </div>
    );
  }

  // Row renderer for react-window - this function receives { index, style }
  const Row = ({ index, style }) => {
    const song = songs[index];
    if (!song) return null;

    // Get setlist-specific key override if it exists
    const keyOverride = currentSetList && songKeys
      ? songKeys[song.id]
      : undefined;

    const isCompleted = completedSongs && completedSongs[song.id];
    const isSelected = selectedSongId === song.id;

    return (
      <div style={style} key={song.id}>
        <SongListItem
          song={song}
          isActive={isSelected}
          onSelect={() => onSelectSong(song)}
          onEdit={() => onEditSong(song)}
          onDelete={() => onDeleteSong(song.id)}
          setLists={setLists}
          onAddToSetLists={(setlistIds) => onAddToSetLists(song.id, setlistIds)}
          onRemoveFromSetList={(setlistId, songId) => onRemoveFromSetList(setlistId, songId)}
          currentSetList={currentSetList}
          overrideKey={keyOverride || null}
          onSetListKeyChange={(key) => onSetListKeyChange(currentSetList, song.id, key)}
          viewMode={viewMode}
          isCompleted={isCompleted}
          onToggleCompleted={onToggleCompleted ? () => onToggleCompleted(song.id) : null}
        />
      </div>
    );
  };

  return (
    <List
      height={listHeight}
      itemCount={songs.length}
      itemSize={ITEM_HEIGHT}
      width="100%"
      overscanCount={5}
    >
      {Row}
    </List>
  );
}
