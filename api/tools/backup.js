

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
    // 1. Get all user tables (ignore sqlite internal tables)
    const tablesRes = await client.execute(
      `SELECT name, sql FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'`
    );
    const tables = tablesRes.rows;

    // 2. Collect CREATE TABLE statements
    const createTableStmts = tables.map(row => row.sql).filter(Boolean);

    // 3. Collect INSERT statements for each table
    const insertStmts = [];
    for (const { name } of tables) {
      const rowsRes = await client.execute(`SELECT * FROM "${name}"`);
      for (const row of rowsRes.rows) {
        const columns = Object.keys(row).map(col => `"${col}"`).join(', ');
        const values = Object.values(row)
          .map(val =>
            val === null
              ? 'NULL'
              : typeof val === 'number'
              ? val
              : `'${String(val).replace(/'/g, "''")}'`
          )
          .join(', ');
        insertStmts.push(`INSERT INTO "${name}" (${columns}) VALUES (${values});`);
      }
    }

    // 4. Output as .sql file
    const sqlContent =
      '-- CREATE TABLES --\n' +
      createTableStmts.join('\n') +
      '\n\n-- INSERTS --\n' +
      insertStmts.join('\n') +
      '\n';

    res.setHeader('Content-Type', 'application/sql');
    res.setHeader('Content-Disposition', 'attachment; filename="backup-' + new Date().toISOString().replace(/[:.]/g, '-') + '.sql"');
    res.status(200).send(sqlContent);
  } catch (e) {
    res.status(500).json({ error: 'Backup failed', details: e.message });
  }
}
