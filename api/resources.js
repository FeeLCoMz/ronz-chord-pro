/**
 * Consolidated Resources Router
 * Handles practice sessions and gigs to reduce function count
 */

import practiceIndexHandler from './practice/index.js';
import practiceIdHandler from './practice/[id].js';
import gigsIndexHandler from './gigs/index.js';
import gigsIdHandler from './gigs/[id].js';

export default async function handler(req, res) {
  // Use req.baseUrl (from Express mount point) or full URL (from Vercel)
  const baseUrl = req.baseUrl || '';
  const path = req.path || req.url.split('?')[0];
  const fullPath = baseUrl + path;
  
  // Determine which resource based on the URL
  const isPractice = fullPath.includes('/practice');
  const isGigs = fullPath.includes('/gigs');
  
  // Extract ID from path if present (path relative to mount point)
  const relativePath = path.replace(/^\//, ''); // Remove leading slash
  const id = relativePath && !isNaN(relativePath) ? relativePath : null;
  
  if (isPractice) {
    if (id) {
      req.query = { ...req.query, id };
      req.params = { ...req.params, id };
      return practiceIdHandler(req, res);
    } else {
      return practiceIndexHandler(req, res);
    }
  }
  
  if (isGigs) {
    if (id) {
      req.query = { ...req.query, id };
      req.params = { ...req.params, id };
      return gigsIdHandler(req, res);
    } else {
      return gigsIndexHandler(req, res);
    }
  }
  
  res.status(404).json({ error: 'Resource not found' });
}
