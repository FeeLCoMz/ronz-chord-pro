import express from 'express';
import { getTursoClient } from '../_turso.js';
import { randomUUID } from 'crypto';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const client = getTursoClient();
    await client.execute(
      `CREATE TABLE IF NOT EXISTS songs (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        artist TEXT,
        youtubeId TEXT,
        melody TEXT,
        lyrics TEXT,
        createdAt TEXT DEFAULT (datetime('now')),
        updatedAt TEXT
      )`
    );
    const rows = await client.execute(
      `SELECT id, title, artist, youtubeId, melody, lyrics, createdAt, updatedAt
       FROM songs
       ORDER BY (updatedAt IS NULL) ASC, datetime(updatedAt) DESC, datetime(createdAt) DESC`
    );
    res.status(200).json(rows.rows ?? []);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const client = getTursoClient();
    const body = req.body;
    const id = body.id?.toString() || randomUUID();
    const now = new Date().toISOString();
    await client.execute(
      `INSERT INTO songs (id, title, artist, youtubeId, melody, lyrics, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        body.title || '',
        body.artist || null,
        body.youtubeId || null,
        body.melody || null,
        body.lyrics || null,
        body.createdAt || now,
        now,
      ]
    );
    res.status(201).json({ id });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
});

export default router;
