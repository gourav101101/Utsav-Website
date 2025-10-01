const crypto = require('crypto');

// Simple in-memory token store. Tokens expire after TTL seconds.
const TTL_SECONDS = parseInt(process.env.ADMIN_TOKEN_TTL || '3600', 10);
const tokens = new Map(); // token -> expiry (ms)

function createToken() {
  const token = crypto.randomBytes(24).toString('hex');
  const expiresAt = Date.now() + TTL_SECONDS * 1000;
  tokens.set(token, expiresAt);
  return token;
}

function validateToken(token) {
  if (!token) return false;
  const exp = tokens.get(token);
  if (!exp) return false;
  if (Date.now() > exp) {
    tokens.delete(token);
    return false;
  }
  return true;
}

// Periodic cleanup
setInterval(() => {
  const now = Date.now();
  for (const [t, exp] of tokens.entries()) {
    if (now > exp) tokens.delete(t);
  }
}, 60 * 1000);

module.exports = { createToken, validateToken };
