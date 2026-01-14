# Custom Hooks Refactoring Guide

Aplikasi RoNz Chord Pro telah di-refactor menggunakan custom hooks untuk memisahkan logika state management.

## Hooks yang Tersedia

### 1. `useSongs(setLists, currentSetList)`

Mengelola state dan logic terkait songs (lagu).

**Returns:**

- `songs` - Array of songs
- `selectedSong` - Currently selected song
- `showSongForm` - Song form visibility
- `editingSong` - Song being edited
- `transpose` - Current transpose value
- `sortBy` - Sort preference
- `handleTranspose(value)` - Adjust transpose
- `handleSelectSong(song)` - Select a song
- `handleSaveSong(songData)` - Save song
- `handleDeleteSong(songId)` - Delete song
- `handleEditSong(song)` - Edit song

**Usage:**

```jsx
const { songs, selectedSong, handleSelectSong, handleSaveSong } = useSongs(
  setLists,
  currentSetList
);
```

### 2. `useSetLists(songs)`

Mengelola state dan logic terkait setlists.

**Returns:**

- `setLists` - Array of setlists
- `currentSetList` - Currently selected setlist ID
- `showSetListForm` - Setlist form visibility
- `editingSetList` - Setlist being edited
- `showSetlistView` - Setlist view visibility
- `handleCreateSetList(name)` - Create new setlist
- `handleUpdateSetList(id, name)` - Update setlist
- `handleDeleteSetList(id)` - Delete setlist
- `handleDuplicateSetList(id)` - Duplicate setlist
- `handleAddSongToSetList(setListId, songId)` - Add song
- `handleRemoveSongFromSetList(setListId, songId)` - Remove song
- `handleSetListSongKey(setListId, songId, key)` - Override song key
- `handleToggleCompletedSong(setListId, songId)` - Toggle song completion
- `getSetListSongs()` - Get songs in current setlist
- `getCurrentSongIndexInSetList(selectedSong)` - Get song index

**Usage:**

```jsx
const { setLists, currentSetList, handleCreateSetList, getSetListSongs } =
  useSetLists(songs);
```

### 3. `usePerformanceMode()`

Mengelola state dan logic untuk performance mode.

**Returns:**

- `performanceMode` - Boolean
- `performanceTheme` - Current theme
- `performanceFontSize` - Font size percentage
- `showSetlistView` - Setlist visibility
- `togglePerformanceMode()` - Toggle mode
- `cyclePerformanceTheme()` - Cycle themes
- `increaseFontSize()` - Increase font size
- `decreaseFontSize()` - Decrease font size
- `resetFontSize()` - Reset to 100%

**Usage:**

```jsx
const {
  performanceMode,
  performanceFontSize,
  togglePerformanceMode,
  increaseFontSize,
} = usePerformanceMode();
```

### 4. `useDatabase(songs, setSongs, setLists, setSetLists)`

Mengelola state database, recovery, dan error handling.

**Returns:**

- `recoveryNotification` - Recovery notification state
- `runtimeErrors` - Array of runtime errors
- `isInitialLoad` - Ref to track initial load
- `dismissError(id)` - Dismiss error message
- `handleExportDatabase()` - Export data to JSON
- `handleImportDatabase(event)` - Import data from JSON

**Usage:**

```jsx
const {
  recoveryNotification,
  runtimeErrors,
  handleExportDatabase,
  handleImportDatabase,
} = useDatabase(songs, setSongs, setLists, setSetLists);
```

## Implementasi di App.jsx

Untuk menggunakan hooks di App.jsx:

```jsx
import {
  useSongs,
  useSetLists,
  usePerformanceMode,
  useDatabase,
} from "./hooks";

function App() {
  // Initialize hooks (order matters - setLists di-pass ke useSongs)
  const performanceMode = usePerformanceMode();
  const setLists = useSetLists(songs);
  const songs = useSongs(setLists.setLists, setLists.currentSetList);
  const database = useDatabase(
    songs.songs,
    songs.setSongs,
    setLists.setLists,
    setLists.setSetLists
  );

  // Kemudian gunakan state dan handlers dari masing-masing hook
  // ...
}
```

## Keuntungan Refactoring

1. **Separation of Concerns** - Logika terpisah per domain
2. **Reusability** - Hooks bisa digunakan di components lain
3. **Testability** - Easier to test individual hooks
4. **Maintainability** - Code lebih mudah dipahami
5. **Scalability** - Lebih mudah menambah features baru

## Langkah Selanjutnya

1. Refactor App.jsx untuk menggunakan hooks
2. Extract UI logic ke Context API untuk prop drilling yang lebih baik
3. Implementasikan Service Worker (offline support)
4. Add keyboard shortcuts
5. Implementasikan virtual scrolling
