/**
 * Consolidated bands handler  
 * Handles: GET/POST /api/bands, GET/PUT/DELETE /api/bands/:id, /api/bands/:id/members, etc.
 */

import bandsIndexHandler from '../server/bands/index.js';
import bandsIdHandler from '../server/bands/[id].js';
import bandMembersHandler from '../server/bands/members.js';
import bandInvitationsHandler from '../server/bands/invitations.js';
import bandInvIdHandler from '../server/bands/invitations/[id].js';
import { verifyToken } from '../server/_auth.js';

export default async function consolidatedBandsHandler(req, res) {
  try {
    // Ensure token is verified (in case this is called directly on Vercel without middleware)
    if (!req.user && !verifyToken(req, res)) {
      return;
    }

    const path = req.path || req.url || '';
    const pathParts = path.split('/').filter(Boolean);
    // When mounted at /api/bands, path is relative:
    // /bands -> pathParts = ['bands'] or []
    // /bands/:id -> pathParts = ['bands', 'id'] or ['id']
    // /bands/:id/members -> pathParts = ['bands', 'id', 'members'] or ['id', 'members']
    // /bands/invitations/:id -> pathParts = ['bands', 'invitations', 'id'] or ['invitations', 'id']

    const bandId = pathParts[0];
    const secondSegment = pathParts[1];
    const thirdSegment = pathParts[2];

    // Handle invitations: /api/bands/invitations or /api/bands/invitations/:id
    if (bandId === 'invitations') {
      if (secondSegment) {
        // /api/bands/invitations/:id
        req.params = { ...req.params, invId: secondSegment };
        return await bandInvIdHandler(req, res);
      } else {
        // /api/bands/invitations
        return await bandInvitationsHandler(req, res);
      }
    }

    // Handle nested paths like /api/bands/:id/members
    if (secondSegment === 'members') {
      req.params = { ...req.params, id: bandId };
      return await bandMembersHandler(req, res);
    }

    // Handle /api/bands/:id
    if (bandId && secondSegment !== 'members' && secondSegment !== 'invitations') {
      req.params = { ...req.params, id: bandId };
      return await bandsIdHandler(req, res);
    }

    // Handle /api/bands
    return await bandsIndexHandler(req, res);
  } catch (error) {
    console.error('Bands handler error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
