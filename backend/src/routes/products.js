const express = require('express');
const Product = require('../models/product');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

// GET /api/products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 }).lean();
    // Ensure compatibility: return `image` for older clients but also include `images`.
  const rows = products.map(p => ({ ...p, image: (p.images && p.images.length > 0) ? p.images[0] : (p.image || ''), images: p.images || (p.image ? [p.image] : []), inclusions: p.inclusions || [] }));
    res.json({ success: true, rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const p = await Product.findById(req.params.id).lean();
    if (!p) return res.status(404).json({ success: false, error: 'Not found' });
  const row = { ...p, image: (p.images && p.images.length > 0) ? p.images[0] : (p.image || ''), images: p.images || (p.image ? [p.image] : []), inclusions: p.inclusions || [] };
    res.json({ success: true, row });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/products (admin)
router.post('/', adminAuth, async (req, res) => {
  try {
  const { title, description, image, images, price, category, inclusions } = req.body;
    const imgs = Array.isArray(images) ? images : (image ? [image] : []);
    if (!title && imgs.length === 0) return res.status(400).json({ success: false, error: 'product must include title or image' });
  const incs = Array.isArray(inclusions) ? inclusions.map(i => String(i)) : [];
  const p = new Product({ title, description, images: imgs, price: price ? String(price) : '', category, inclusions: incs });
    await p.save();
    res.json({ success: true, id: p._id, type: 'product' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/products/:id (admin)
router.put('/:id', adminAuth, async (req, res) => {
  try {
  const { title, description, image, images, price, category, inclusions } = req.body;
    const imgs = Array.isArray(images) ? images : (image ? [image] : []);
  const incs = Array.isArray(inclusions) ? inclusions.map(i => String(i)) : [];
  const updated = await Product.findByIdAndUpdate(req.params.id, { title, description, images: imgs, price: price ? String(price) : '', category, inclusions: incs }, { new: true });
    const row = { ...updated.toObject(), image: (updated.images && updated.images.length > 0) ? updated.images[0] : '', images: updated.images || [] };
    res.json({ success: true, row });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/products/:id (admin)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
