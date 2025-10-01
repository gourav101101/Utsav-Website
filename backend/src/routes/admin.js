const express = require('express');
const router = express.Router();
const { createToken } = require('../authTokens');

// Credentials can be set in env: ADMIN_USERNAME and ADMIN_PASSWORD
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '123';

router.post('/login', (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ success: false, error: 'Missing credentials' });
  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) return res.status(401).json({ success: false, error: 'Invalid credentials' });
  const token = createToken();
  return res.json({ success: true, token });
});

module.exports = router;
