import { getTursoClient } from '../_turso.js';
import { verifyToken } from '../_auth.js';

export default async function handler(req, res) {
  if (!verifyToken(req, res)) return;
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const client = getTursoClient();
  try {
    // Use Turso's dump API if available, else fallback to manual SQL
    // For demo: dump all tables as SQL INSERTs
    const tables = ['songs', 'setlists', 'bands', 'users'];
    let sql = '';
    for (const table of tables) {
      const rows = (await client.execute(`SELECT * FROM ${table}`)).rows;
      for (const row of rows) {
        const keys = Object.keys(row);
        const values = keys.map(k => typeof row[k] === 'string' ? `'${row[k].replace(/'/g, "''")}'` : row[k] === null ? 'NULL' : row[k]);
        sql += `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${values.join(', ')});\n`;
      }
    }
    res.status(200).json({ sql });
  } catch (e) {
    res.status(500).json({ error: 'Backup failed', details: e.message });
  }
}
