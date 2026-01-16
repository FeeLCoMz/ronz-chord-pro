import { getTursoClient } from '../_turso.js';

async function readJson(req) {
  if (req.body) return req.body;
  return await new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => { data += chunk; });
    req.on('end', () => {
      try { resolve(data ? JSON.parse(data) : {}); }
      catch (e) { reject(e); }
    });
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  try {
    const client = getTursoClient();
    const body = await readJson(req);
    const setlists = body.setlists || [];

    if (!Array.isArray(setlists) || setlists.length === 0) {
      res.status(400).json({ error: 'No setlists provided' });
      return;
    }

    // Ensure table exists
    await client.execute(
      `CREATE TABLE IF NOT EXISTS setlists (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        songs TEXT,
        songKeys TEXT,
        completedSongs TEXT DEFAULT '{}',
        createdAt TEXT DEFAULT (datetime('now')),
        updatedAt TEXT
      )`
    );

    let inserted = 0;
    let updated = 0;
    let errors = 0;
    let skipped = 0;

    for (const setlist of setlists) {
      try {
        // Skip untitled setlists
        if (!setlist.name || setlist.name.trim() === '' || setlist.name.toLowerCase().includes('untitled')) {
          skipped++;
          continue;
        }

        const id = setlist.id?.toString() || Date.now().toString();
        const now = new Date().toISOString();
        const songsJson = JSON.stringify(setlist.songs || []);
        const songKeysJson = JSON.stringify(setlist.songKeys || {});
        const completedSongsJson = JSON.stringify(setlist.completedSongs || {});

        // Try insert, if exists do update
        const result = await client.execute(
          `INSERT INTO setlists (id, name, songs, songKeys, completedSongs, createdAt, updatedAt)
           VALUES (?, ?, ?, ?, ?, ?, ?)
           ON CONFLICT(id) DO UPDATE SET
             name = excluded.name,
             songs = excluded.songs,
             songKeys = excluded.songKeys,
             completedSongs = excluded.completedSongs,
             updatedAt = excluded.updatedAt`,
          [
            id,
            setlist.name.trim(),
            songsJson,
            songKeysJson,
            completedSongsJson,
            setlist.createdAt || now,
            now,
          ]
        );

        if (result.rowsAffected > 0) {
          inserted++;
        } else {
          updated++;
        }
      } catch (err) {
        console.error('Error syncing setlist:', setlist.name, err);
        errors++;
      }
    }

    res.status(200).json({
      success: true,
      total: setlists.length,
      inserted,
      updated,
      errors,
      skipped
    });
  } catch (err) {
    console.error('API /api/setlists/sync error:', err);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
}