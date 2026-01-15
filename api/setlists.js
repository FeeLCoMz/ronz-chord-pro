import { getTursoClient } from './_turso.js';
import { randomUUID } from 'crypto';

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
  const client = getTursoClient();
  const url = req.url || '';
  const method = req.method;

  // /api/setlists/sync
  if (url.startsWith('/api/setlists/sync')) {
    if (method !== 'POST') {
      res.setHeader('Allow', 'POST');
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }
    const body = await readJson(req);
    const setlists = body.setlists || [];
    if (!Array.isArray(setlists) || setlists.length === 0) {
      res.status(400).json({ error: 'No setlists provided' });
      return;
    }
    await client.execute(
      `CREATE TABLE IF NOT EXISTS setlists (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        songs TEXT DEFAULT '[]',
        songKeys TEXT DEFAULT '{}',
        completedSongs TEXT DEFAULT '{}',
        createdAt TEXT DEFAULT (datetime('now')),
        updatedAt TEXT
      )`
    );
    for (const setlist of setlists) {
      await client.execute(
        `INSERT OR REPLACE INTO setlists (id, name, songs, songKeys, completedSongs, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, COALESCE((SELECT createdAt FROM setlists WHERE id = ?), datetime('now')), datetime('now'))`,
        [setlist.id, setlist.name, setlist.songs, setlist.songKeys, setlist.completedSongs, setlist.id]
      );
    }
    res.json({ success: true, count: setlists.length });
    return;
  }

  // /api/setlists/:id
  const idMatch = url.match(/^\/api\/setlists\/(.+)$/);
  if (idMatch && !url.startsWith('/api/setlists/sync')) {
    const id = decodeURIComponent(idMatch[1]);
    if (!id) {
      res.status(400).json({ error: 'Missing setlist id' });
      return;
    }
    if (method === 'GET') {
      const result = await client.execute(
        `SELECT id, name, songs, songKeys, completedSongs, createdAt, updatedAt
         FROM setlists WHERE id = ? LIMIT 1`,
        [id]
      );
      const setlist = result.rows[0];
      if (!setlist) {
        res.status(404).json({ error: 'Setlist not found' });
        return;
      }
      res.json(setlist);
      return;
    }
    if (method === 'PUT') {
      const body = await readJson(req);
      await client.execute(
        `UPDATE setlists SET name=?, songs=?, songKeys=?, completedSongs=?, updatedAt=datetime('now') WHERE id=?`,
        [body.name, body.songs, body.songKeys, body.completedSongs, id]
      );
      res.json({ success: true });
      return;
    }
    if (method === 'DELETE') {
      await client.execute(`DELETE FROM setlists WHERE id=?`, [id]);
      res.json({ success: true });
      return;
    }
    res.setHeader('Allow', 'GET,PUT,DELETE');
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // /api/setlists (list & create)
  if (url.startsWith('/api/setlists')) {
    if (method === 'GET') {
      await client.execute(
        `CREATE TABLE IF NOT EXISTS setlists (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          songs TEXT DEFAULT '[]',
          songKeys TEXT DEFAULT '{}',
          completedSongs TEXT DEFAULT '{}',
          createdAt TEXT DEFAULT (datetime('now')),
          updatedAt TEXT
        )`
      );
      const rows = await client.execute(
        `SELECT id, name, songs, songKeys, completedSongs, createdAt, updatedAt
         FROM setlists
         ORDER BY (updatedAt IS NULL) ASC, datetime(updatedAt) DESC, datetime(createdAt) DESC`
      );
      res.json(rows.rows);
      return;
    }
    if (method === 'POST') {
      const body = await readJson(req);
      const id = body.id || randomUUID();
      await client.execute(
        `INSERT INTO setlists (id, name, songs, songKeys, completedSongs, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, datetime('now'), NULL)`,
        [id, body.name, body.songs, body.songKeys, body.completedSongs]
      );
      res.json({ success: true, id });
      return;
    }
    res.setHeader('Allow', 'GET,POST');
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // Fallback
  res.status(404).json({ error: 'Not found' });
}
