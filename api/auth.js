import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { getTursoClient } from './_turso.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

async function readJson(req) {
  if (req.body) return req.body;
  return await new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => { data += chunk; });
    req.on('end', () => {
      try { resolve(data ? JSON.parse(data) : {}); }
      catch (e) { reject(e); }
    });
    req.on('error', reject);
  });
}

// Initialize database tables
async function initTables(client) {
  await client.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
      email TEXT UNIQUE NOT NULL,
      username TEXT UNIQUE NOT NULL,
      passwordHash TEXT NOT NULL,
      createdAt TEXT DEFAULT (datetime('now')),
      updatedAt TEXT,
      twoFactorSecret TEXT,
      twoFactorEnabled INTEGER DEFAULT 0
    )
  `);
}

// Auth router - handles all auth endpoints
export default async function handler(req, res) {
  try {
    const client = getTursoClient();
    await initTables(client);

    // Parse URL path to determine route
    const url = req.url || '';
    const path = url.split('?')[0];

    // Route to appropriate handler
    if (path.endsWith('/login') || (path === '/api/auth' && req.method === 'POST')) {
      return await handleLogin(req, res, client);
    } else if (path.endsWith('/register')) {
      return await handleRegister(req, res, client);
    } else if (path.endsWith('/me')) {
      return await handleMe(req, res, client);
    } else if (path.endsWith('/forgot-password')) {
      return await handleForgotPassword(req, res, client);
    } else if (path.endsWith('/reset-password')) {
      return await handleResetPassword(req, res, client);
    } else if (path.endsWith('/2fa-setup')) {
      return await handle2FASetup(req, res, client);
    } else if (path.endsWith('/2fa-verify')) {
      return await handle2FAVerify(req, res, client);
    }

    // Default route (backward compatibility with index.js)
    if (req.method === 'POST') {
      const body = await readJson(req);
      if (body.username) {
        return await handleRegister(req, res, client, body);
      } else {
        return await handleLogin(req, res, client, body);
      }
    }

    return res.status(404).json({ error: 'Auth endpoint not found' });

  } catch (error) {
    console.error('Auth router error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

// LOGIN handler
async function handleLogin(req, res, client, bodyData = null) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = bodyData || await readJson(req);
  const { email, password } = body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  const result = await client.execute(
    'SELECT id, email, username, passwordHash, twoFactorEnabled FROM users WHERE email = ?',
    [email]
  );

  if (!result.rows || result.rows.length === 0) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const user = result.rows[0];
  const isValidPassword = await bcrypt.compare(password, user.passwordHash);
  
  if (!isValidPassword) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  // Check if 2FA is enabled
  if (user.twoFactorEnabled) {
    return res.status(200).json({
      requires2FA: true,
      userId: user.id
    });
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email, username: user.username },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return res.status(200).json({
    success: true,
    message: 'Login successful',
    token,
    user: { id: user.id, email: user.email, username: user.username }
  });
}

// REGISTER handler
async function handleRegister(req, res, client, bodyData = null) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = bodyData || await readJson(req);
  const { email, username, password } = body;

  if (!email || !username || !password) {
    return res.status(400).json({ error: 'Email, username, and password required' });
  }

  const existing = await client.execute(
    'SELECT id FROM users WHERE email = ?',
    [email]
  );

  if (existing.rows && existing.rows.length > 0) {
    return res.status(409).json({ error: 'Email already exists' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  await client.execute(
    'INSERT INTO users (id, email, username, passwordHash) VALUES (?, ?, ?, ?)',
    [userId, email, username, passwordHash]
  );

  const token = jwt.sign(
    { userId, email, username },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return res.status(201).json({
    token,
    user: { id: userId, email, username }
  });
}

// ME handler
async function handleMe(req, res, client) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  const result = await client.execute(
    'SELECT id, email, username, createdAt FROM users WHERE id = ?',
    [decoded.userId]
  );

  if (!result.rows || result.rows.length === 0) {
    return res.status(404).json({ error: 'User not found' });
  }

  const user = result.rows[0];

  return res.status(200).json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      createdAt: user.createdAt
    }
  });
}

// FORGOT PASSWORD handler (placeholder)
async function handleForgotPassword(req, res, client) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = await readJson(req);
  const { email } = body;

  if (!email) {
    return res.status(400).json({ error: 'Email required' });
  }

  // TODO: Implement email sending
  // For now, just return success
  return res.status(200).json({
    success: true,
    message: 'Password reset link sent to email (not implemented)'
  });
}

// RESET PASSWORD handler (placeholder)
async function handleResetPassword(req, res, client) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = await readJson(req);
  const { token, password } = body;

  if (!token || !password) {
    return res.status(400).json({ error: 'Token and password required' });
  }

  // TODO: Implement token validation and password reset
  return res.status(200).json({
    success: true,
    message: 'Password reset successful (not implemented)'
  });
}

// 2FA SETUP handler (placeholder)
async function handle2FASetup(req, res, client) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  // TODO: Implement 2FA setup
  return res.status(200).json({
    success: true,
    secret: 'placeholder_secret',
    qrCode: 'placeholder_qr_code'
  });
}

// 2FA VERIFY handler (placeholder)
async function handle2FAVerify(req, res, client) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = await readJson(req);
  const { userId, token: tfaToken } = body;

  if (!userId || !tfaToken) {
    return res.status(400).json({ error: 'User ID and token required' });
  }

  // TODO: Implement 2FA verification
  const token = jwt.sign(
    { userId },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return res.status(200).json({
    success: true,
    token
  });
}
