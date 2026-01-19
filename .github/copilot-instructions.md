# Copilot & AI Agent Instructions for RoNz Chord Pro

## Project Overview
- **RoNz Chord Pro** is a React (Vite) app for musicians to manage, display, and edit song chords/lyrics, supporting ChordPro and standard formats.
- Backend API (in `api/`) enables cloud sync with Turso (libsql) DB, used for song/setlist storage and management.
- LocalStorage is used for custom songs and setlists when not syncing.

## Key Architecture & Patterns
- **Frontend:**
  - Main entry: `src/main.jsx`, root: `src/App.jsx`.
  - UI is component-driven (`src/components/`), e.g. `ChordDisplay.jsx`, `SongForm.jsx`, `SetListForm.jsx`, `YouTubeViewer.jsx`.
  - State and data hooks in `src/hooks/` (e.g. `useSongs.js`, `useSetLists.js`, `useDatabase.js`).
  - Utility logic in `src/utils/` (e.g. `chordUtils.js`, `musicNotationUtils.js`).
- **Backend API:**
  - Vercel serverless functions in `api/` (see `api/songs/`, `api/setlists/`).
  - DB schema in `db/schema.sql`.
  - API endpoints: `/api/songs`, `/api/setlists` (CRUD, JSON).
- **AI Integration:**
  - AI assistant features in `src/components/AiAssistant.jsx` and `api/ai.js`.
  - See `AI_ASSISTANT.md` and `AI_ASSISTANT_IMPLEMENTATION.md` for details.

## Developer Workflows
- **Install:** `npm install`
- **Dev server:** `npm run dev` (Vite, port 5173)
- **Build:** `npm run build`
- **Preview:** `npm run preview` (port 4173)
- **API local dev:** Use Vercel CLI (`vercel dev`), see README for env setup.
- **Update deps:** `npm run update`

## Project-Specific Conventions
- **Song data**: Prefer UI for adding/editing, but can edit `src/data/songs.js` for static songs.
- **Chord formats:** ChordPro and standard (chord-above-lyrics) both supported; see `EXAMPLE_FORMATS.md`.
- **Keyboard shortcuts:** See `KEYBOARD_SHORTCUTS.md` for all navigation and editing hotkeys.
- **Bulk add:** Use `BulkAddSongsModal.jsx` and see `BULK_ADD_SONGS.md` for batch import/search.
- **Notifications:** Use `Toast.jsx`/`ToastContainer.jsx` for user feedback (no `alert()`).
- **Virtual scrolling:** For large lists, see `VirtualizedSongList.jsx` and `VIRTUAL_SCROLLING.md`.
- **Service worker:** See `public/service-worker.js` and `SERVICE_WORKER_GUIDE.md` for PWA/offline.

## Integration & External Dependencies
- **YouTube:** Embedded via IFrame API (`YouTubeViewer.jsx`).
- **Turso DB:** API integration via Vercel serverless (`api/`), see ENV_SETUP.md for keys.
- **AI:** Uses external AI APIs for metadata and transcription (see `AI_ASSISTANT.md`).

## References
- Main docs: `README.md`, `COMPLETE_FEATURES.md`, `AI_ASSISTANT.md`, `DEVELOPERS_GUIDE.md`
- For new features, follow patterns in `src/components/` and `src/hooks/`.
- For backend, see `api/` and `db/schema.sql`.

---

**If unsure about a pattern or workflow, check the referenced docs or ask for clarification.**
