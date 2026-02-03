/**
 * Consolidated songs handler
 * Handles: GET/POST /api/songs, GET/PUT/DELETE /api/songs/:id
 */

import songsIndexHandler from './songs/index.js';
import songsIdHandler from './songs/[id].js';
import { verifyToken } from './_auth.js';

export default async function consolidatedSongsHandler(req, res) {
  try {
    // Ensure token is verified (in case this is called directly on Vercel without middleware)
    if (!req.user && !verifyToken(req, res)) {
      return;
    }

    // Extract song ID from path (path is relative to mount point when using app.use)
    const path = req.path || req.url || '';
    const pathParts = path.split('/').filter(Boolean);
    const songId = pathParts[0]; // First part after /songs mount point

    if (songId) {
      // Route to [id].js handler
      req.params = { ...req.params, id: songId };
      return await songsIdHandler(req, res);
    } else {
      // Route to index.js handler
      return await songsIndexHandler(req, res);
    }
  } catch (error) {
    console.error('Songs handler error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
