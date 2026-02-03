/**
 * Consolidated setlists handler
 * Handles: GET/POST /api/setlists, GET/PUT/DELETE /api/setlists/:id
 */

import setlistsIndexHandler from './setlists/index.js';
import setlistsIdHandler from './setlists/[id].js';
import { verifyToken } from './_auth.js';

export default async function consolidatedSetlistsHandler(req, res) {
  try {
    // Ensure token is verified (in case this is called directly on Vercel without middleware)
    if (!req.user && !verifyToken(req, res)) {
      return;
    }

    // Extract setlist ID from path (path is relative to mount point when using app.use)
    const path = req.path || req.url || '';
    const pathParts = path.split('/').filter(Boolean);
    const setlistId = pathParts[0]; // First part after /setlists mount point

    if (setlistId) {
      // Route to [id].js handler
      req.params = { ...req.params, id: setlistId };
      return await setlistsIdHandler(req, res);
    } else {
      // Route to index.js handler
      return await setlistsIndexHandler(req, res);
    }
  } catch (error) {
    console.error('Setlists handler error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
