const express = require('express');
const Inquiry = require('../models/inquiry');

const router = express.Router();

// GET /api/inquiries
router.get('/', async (req, res) => {
  try {
    const rows = await Inquiry.find({}).sort({ createdAt: -1 }).lean();
    res.json({ success: true, rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/inquiries
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, service, message } = req.body;
    const i = new Inquiry({ name, email, phone, service, message });
    await i.save();
    res.json({ success: true, id: i._id, type: 'inquiry' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
