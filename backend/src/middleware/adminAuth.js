const { validateToken } = require('../authTokens');

module.exports = function adminAuth(req, res, next) {
  // Primary server-side secret
  const key = process.env.ADMIN_API_KEY || '';
  const sent = req.headers['x-admin-key'] || req.query.adminKey || req.body.adminKey || '';

  // Optional debug logging. Enable by setting DEBUG_ADMIN_AUTH=1 in the backend environment.
  if (process.env.DEBUG_ADMIN_AUTH === '1') {
    const mask = (s = '') => (s && s.length > 8 ? `${s.slice(0,4)}...${s.slice(-4)}` : s);
    console.log('adminAuth debug: keyConfigured=', !!key, 'keyMask=', mask(key), 'sentMask=', mask(sent), 'equal=', sent === key, 'tokenValid=', validateToken(sent));
  }

  // If ADMIN_API_KEY is configured, accept that OR a valid session token
  if (!key && !validateToken(sent)) return res.status(403).json({ success: false, error: 'Admin API key not configured' });
  if (key && sent !== key && !validateToken(sent)) return res.status(401).json({ success: false, error: 'Invalid admin API key or token' });
  next();
};

