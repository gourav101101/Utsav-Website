module.exports = function adminAuth(req, res, next) {
  // Allow the backend to read either ADMIN_API_KEY (recommended) or VITE_ADMIN_KEY
  // This helps when developers accidentally set the frontend env var in the backend.
  const key = process.env.ADMIN_API_KEY || process.env.VITE_ADMIN_KEY || '';
  const sent = req.headers['x-admin-key'] || req.query.adminKey || req.body.adminKey || '';

  // Optional debug logging. Enable by setting DEBUG_ADMIN_AUTH=1 in the backend environment.
  if (process.env.DEBUG_ADMIN_AUTH === '1') {
    const mask = (s = '') => (s && s.length > 8 ? `${s.slice(0,4)}...${s.slice(-4)}` : s);
    console.log('adminAuth debug: keyConfigured=', !!key, 'keyMask=', mask(key), 'sentMask=', mask(sent), 'equal=', sent === key);
  }

  if (!key) return res.status(403).json({ success: false, error: 'Admin API key not configured' });
  if (sent !== key) return res.status(401).json({ success: false, error: 'Invalid admin API key' });
  next();
};

