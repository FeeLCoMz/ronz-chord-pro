/**
 * Consolidated Resources Router
 * Handles practice sessions and gigs to reduce function count
 */

import practiceIndexHandler from './practice/index.js';
import practiceIdHandler from './practice/[id].js';
import gigsIndexHandler from './gigs/index.js';
import gigsIdHandler from './gigs/[id].js';

export default async function handler(req, res) {
  const path = req.url.split('?')[0];
  
  // Practice sessions routes
  if (path === '/api/resources/practice' || path === '/api/practice') {
    return practiceIndexHandler(req, res);
  }
  
  if (path.startsWith('/api/resources/practice/') || path.startsWith('/api/practice/')) {
    const id = path.split('/').pop();
    req.query = { ...req.query, id };
    req.params = { ...req.params, id };
    return practiceIdHandler(req, res);
  }
  
  // Gigs routes
  if (path === '/api/resources/gigs' || path === '/api/gigs') {
    return gigsIndexHandler(req, res);
  }
  
  if (path.startsWith('/api/resources/gigs/') || path.startsWith('/api/gigs/')) {
    const id = path.split('/').pop();
    req.query = { ...req.query, id };
    req.params = { ...req.params, id };
    return gigsIdHandler(req, res);
  }
  
  res.status(404).json({ error: 'Resource not found' });
}
