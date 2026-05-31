const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser');
const User = require('./models/User');

// Load environment variables
dotenv.config();

// Debug: Log the current working directory and .env file path
console.log('Current working directory:', process.cwd());
console.log('.env file path:', path.resolve(process.cwd(), '.env'));
console.log('MONGODB_URI:', process.env.MONGODB_URI);

// Create Express app
const app = express();

// Allowed origins for CORS (local dev + production frontend(s))
const allowedOrigins = (process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map(s => s.trim())
  : [
      'http://localhost:3000',
      'https://travellers-frontend.vercel.app'
    ]);

const corsOriginCheck = (origin, callback) => {
  // Allow non-browser requests (no Origin header) and any listed origin
  if (!origin) return callback(null, true);
  if (allowedOrigins.includes(origin)) return callback(null, true);
  return callback(new Error(`CORS: origin ${origin} not allowed`));
};

// A user is considered "active" if they've sent a heartbeat in this window.
// Vercel serverless can't host long-lived WebSockets, so presence is DB-backed.
const ACTIVE_WINDOW_MS = 2 * 60 * 1000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: corsOriginCheck,
  credentials: true
}));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB (cached for serverless cold starts)
let mongoConnectionPromise = null;
function connectMongo() {
  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI environment variable is not set');
    return Promise.reject(new Error('MONGODB_URI not configured'));
  }
  if (mongoose.connection.readyState === 1) return Promise.resolve(mongoose.connection);
  if (!mongoConnectionPromise) {
    mongoConnectionPromise = mongoose.connect(process.env.MONGODB_URI)
      .then(conn => {
        console.log('MongoDB Connected');
        return conn;
      })
      .catch(err => {
        console.error('MongoDB connection error:', err);
        mongoConnectionPromise = null;
        throw err;
      });
  }
  return mongoConnectionPromise;
}

// Kick off connection at module load; also ensure each request waits for it
connectMongo().catch(err => console.error('Initial Mongo connect failed:', err.message));

app.use(async (req, res, next) => {
  try {
    await connectMongo();
    next();
  } catch (err) {
    res.status(500).json({ message: 'Database unavailable' });
  }
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/trips', require('./routes/trips'));
app.use('/api/contacts', require('./routes/contacts'));
app.use('/api/feedback', require('./routes/feedback'));
app.use('/api/sessions', require('./routes/sessions'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/users', require('./routes/users'));
app.use('/api/userprofile', require('./routes/userProfile'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/admin', require('./routes/admin'));

// API endpoint to get active users (for admin panel)
// "Active" = heartbeat received within ACTIVE_WINDOW_MS.
app.get('/api/admin/active-users', async (req, res) => {
  try {
    const cutoff = new Date(Date.now() - ACTIVE_WINDOW_MS);
    const users = await User.find({ lastSeenAt: { $gte: cutoff } })
      .select('_id username userType lastSeenAt');

    const activeUsersList = users.map(u => ({
      userId: u._id.toString(),
      username: u.username,
      userType: u.userType,
      status: 'active',
      lastActivity: u.lastSeenAt
    }));

    res.json({ activeUsers: activeUsersList });
  } catch (error) {
    console.error('Error getting active users:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ message: 'API endpoint not found' });
});

// Serve static files from build folder
app.use(express.static(path.join(__dirname, 'build')));

// Serve React app for all non-API routes (SPA fallback)
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
});

// Start server only if not in Vercel/serverless environment
// Vercel sets VERCEL env variable, and in serverless we don't need to listen
if (!process.env.VERCEL && process.env.VERCEL_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export app for Vercel
module.exports = app;
