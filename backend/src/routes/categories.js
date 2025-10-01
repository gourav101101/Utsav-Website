const express = require('express');
const router = express.Router();
const Category = require('../models/category');
const adminAuth = require('../middleware/adminAuth');

// GET /api/categories - list
router.get('/', async (req, res) => {
  try {
    const rows = await Category.find().sort({ createdAt: -1 }).lean();
    return res.json({ success: true, rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: 'Failed to fetch categories' });
  }
});

// POST /api/categories - create (admin)
router.post('/', adminAuth, async (req, res) => {
  try {
    const { name, slug } = req.body;
    const cat = new Category({ name, slug });
    await cat.save();
    return res.json({ success: true, id: cat._id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: 'Failed to create category' });
  }
});

// PUT /api/categories/:id - update (admin)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    const row = await Category.findByIdAndUpdate(id, update, { new: true }).lean();
    return res.json({ success: true, row });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: 'Failed to update category' });
  }
});

// DELETE /api/categories/:id - delete (admin)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    await Category.findByIdAndDelete(id);
    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: 'Failed to delete category' });
  }
});

module.exports = router;
