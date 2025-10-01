const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = require('./db');
const productsRouter = require('./routes/products');
const inquiriesRouter = require('./routes/inquiries');
const categoriesRouter = require('./routes/categories');

const app = express();

// Build allowed origins list (support comma-separated FRONTEND_URL)
const rawFrontend = process.env.FRONTEND_URL || ['https://utsavdecorandevents.firebaseapp.com', 'https://utsavdecorandevents.web.app', 'http://localhost:5173'];
const allowedOrigins = (Array.isArray(rawFrontend) ? rawFrontend : String(rawFrontend).split(',')).map(u => String(u).trim().replace(/\/+$/, ''));

const corsOptions = {
  origin: function (origin, callback) {
    // If no origin (server-to-server or same-origin) allow it
    if (!origin) return callback(null, true);
    const normalized = origin.replace(/\/+$/, '');
    if (allowedOrigins.includes(normalized)) return callback(null, true);
    return callback(new Error('CORS policy: origin not allowed'), false);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'x-admin-key'],
  exposedHeaders: ['x-admin-key'],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(express.json({ limit: '5mb' }));

const PORT = process.env.PORT || 4000;

connectDB()
  .then(() => {
  const adminKeyPresent = !!(process.env.ADMIN_API_KEY || process.env.VITE_ADMIN_KEY);
  console.log('Admin API key configured:', adminKeyPresent);
  app.use('/api/products', productsRouter);
  app.use('/api/inquiries', inquiriesRouter);
  app.use('/api/categories', categoriesRouter);

    app.get('/', (req, res) => res.json({ success: true, message: 'Utsav backend running' }));

    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
  })
  .catch(err => {
    console.error('Failed to connect to DB', err);
    process.exit(1);
  });
