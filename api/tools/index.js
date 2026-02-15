import { getTursoClient } from '../_turso.js';
import { verifyToken } from '../_auth.js';

export default async function handler(req, res) {
  if (!verifyToken(req, res)) return;
  const client = getTursoClient();

  if (req.method === 'GET') {
    // Export all data
    try {
      const [songs, setlists, bands, users] = await Promise.all([
        client.execute('SELECT * FROM songs'),
        client.execute('SELECT * FROM setlists'),
        client.execute('SELECT * FROM bands'),
        client.execute('SELECT * FROM users'),
      ]);
      res.status(200).json({
        songs: songs.rows,
        setlists: setlists.rows,
        bands: bands.rows,
        users: users.rows,
      });
    } catch (e) {
      res.status(500).json({ error: 'Export failed', details: e.message });
    }
    return;
  }

  if (req.method === 'POST') {
    // Import all data (overwrite)
    const { songs, setlists, bands, users } = req.body;
    if (!songs || !setlists || !bands || !users) {
      res.status(400).json({ error: 'Missing data for import' });
      return;
    }
    try {
      // Delete all existing data (CAUTION: destructive)
      await client.execute('DELETE FROM songs');
      await client.execute('DELETE FROM setlists');
      await client.execute('DELETE FROM bands');
      await client.execute('DELETE FROM users');
      // Insert new data
      for (const song of songs) {
        await client.execute(
          'INSERT INTO songs (id, title, artist, userId, bandId, time_markers, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [song.id, song.title, song.artist, song.userId, song.bandId, JSON.stringify(song.time_markers), song.createdAt, song.updatedAt]
        );
      }
      for (const setlist of setlists) {
        await client.execute(
          'INSERT INTO setlists (id, name, userId, bandId, songs, setlistSongMeta, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [setlist.id, setlist.name, setlist.userId, setlist.bandId, JSON.stringify(setlist.songs), JSON.stringify(setlist.setlistSongMeta), setlist.createdAt, setlist.updatedAt]
        );
      }
      for (const band of bands) {
        await client.execute(
          'INSERT INTO bands (id, name, ownerId, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)',
          [band.id, band.name, band.ownerId, band.createdAt, band.updatedAt]
        );
      }
      for (const user of users) {
        await client.execute(
          'INSERT INTO users (id, email, name, password, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)',
          [user.id, user.email, user.name, user.password, user.createdAt, user.updatedAt]
        );
      }
      res.status(200).json({ success: true });
    } catch (e) {
      res.status(500).json({ error: 'Import failed', details: e.message });
    }
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
}
