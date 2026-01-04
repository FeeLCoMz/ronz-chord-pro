import express from 'express';
import { getTursoClient } from '../_turso.js';
import { randomUUID } from 'crypto';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const client = getTursoClient();
    await client.execute(
      `CREATE TABLE IF NOT EXISTS setlists (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        songs TEXT DEFAULT '[]',
        createdAt TEXT DEFAULT (datetime('now')),
        updatedAt TEXT
      )`
    );
    const rows = await client.execute(
      `SELECT id, name, songs, createdAt, updatedAt
       FROM setlists
       ORDER BY (updatedAt IS NULL) ASC, datetime(updatedAt) DESC, datetime(createdAt) DESC`
    );
    const setlists = (rows.rows ?? []).map(row => ({
      id: row.id,
      name: row.name,
      songs: row.songs ? JSON.parse(row.songs) : [],
      createdAt: row.createdAt,
      updatedAt: row.updatedAt
    }));
    res.status(200).json(setlists);
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
    const songsJson = JSON.stringify(body.songs || []);
    await client.execute(
      `INSERT INTO setlists (id, name, songs, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?)`,
      [
        id,
        body.name || 'Untitled Set List',
        songsJson,
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
