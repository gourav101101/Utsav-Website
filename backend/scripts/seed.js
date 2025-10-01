const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('../src/models/category');
const Product = require('../src/models/product');

dotenv.config();

async function run() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI not set in environment');
    process.exit(1);
  }

  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('MongoDB connected for seeding');

  const demoCategories = [
    { name: 'Wedding Services', slug: 'wedding-services' },
    { name: 'Photography', slug: 'photography' },
    { name: 'Catering', slug: 'catering' }
  ];

  for (const c of demoCategories) {
    await Category.findOneAndUpdate({ slug: c.slug }, { $set: c }, { upsert: true, new: true });
    console.log('Upserted category', c.slug);
  }

  const categories = await Category.find().lean();
  const demoProducts = [
    { title: 'Wedding Planner', description: 'Full-service wedding planning', images: ['https://picsum.photos/seed/wedding/1200/800', 'https://picsum.photos/seed/wedding2/1200/800'], price: '2000', category: categories[0]?.slug || 'wedding-services' },
    { title: 'Event Photography', description: 'Capture your best moments', images: ['https://picsum.photos/seed/photo/1200/800'], price: '500', category: categories[1]?.slug || 'photography' },
    { title: 'Deluxe Catering', description: 'Delicious menus for large events', images: ['https://picsum.photos/seed/catering/1200/800'], price: '1000', category: categories[2]?.slug || 'catering' }
  ];

  for (const p of demoProducts) {
    await Product.findOneAndUpdate({ title: p.title }, { $set: p }, { upsert: true, new: true });
    console.log('Upserted product', p.title);
  }

  console.log('Seeding complete');
  process.exit(0);
}

run().catch(err => {
  console.error('Seeding failed', err);
  process.exit(1);
});
