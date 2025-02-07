import dotenv from 'dotenv';
  dotenv.config();
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path from 'path';
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
import session from 'express-session';
import { createClient } from 'redis';
import { RedisStore } from 'connect-redis';
import passport from './config/passport.js';
import mongoose from 'mongoose';
import homeRoutes from './routes/homeRoutes.js';
import apiRoutes from './routes/apiRoutes.js';
import authRoutes from './routes/authRoutes.js';
import {BASE_URL, FRONTEND_BASE_URL} from './utils.js'

const app = express();
const allowedOrigins = [`${BASE_URL}`, `${FRONTEND_BASE_URL}`];


// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log('Blocked by CORS:', origin); // Add debugging
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Explicitly specify methods
  })
);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Redis client setup
const redisClient = createClient({
  username: 'default',
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  }
});

const redisStore = new RedisStore({
  client: redisClient,
  prefix: 'everything-friendly:',
});

redisClient.on('error', (err) => console.error('Redis Client Error:', err));

(async () => {
  try {
    await redisClient.connect();
    console.log('Redis connected successfully');
  } catch (err) {
    console.error('Redis connection failed:', err);
  }
})();

// Session configuration
app.use(
  session({
    store: redisStore,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    proxy: true, // Add this for secure cookies behind a proxy
    cookie: {
      secure: process.env.NODE_ENV === 'production', // Still true in production
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      domain: process.env.NODE_ENV === 'production' ? 'everything-friendly.onrender.com' : undefined    }
  })
);

// Add trust proxy setting for secure cookies
app.set('trust proxy', 1);

// Passport middleware
app.use(passport.initialize());

app.use(passport.session());

// Add after passport.session()
app.use((req, res, next) => {
  console.log('Request session info:', {
    hasSession: !!req.session,
    sessionID: req.sessionID,
    isAuthenticated: req.isAuthenticated(),
    hasUser: !!req.user
  });
  next();
});

// Routes
app.use('/api', apiRoutes);
app.use('/auth', authRoutes);


// Serve static files from the React app in production
if (process.env.NODE_ENV === 'production') {
  // Serve static files from React build folder
  app.use(express.static(path.join(__dirname, '../client/dist')));

  // Catch-all route to handle frontend routes for React in production
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
  });
} else {
  app.use(express.static(path.join(__dirname, '../client/public')))
  app.get('/', (req, res) => {
    res.redirect(`${FRONTEND_BASE_URL}`);
  })
}

// Error handling
app.use((req, res, next) => {
    res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});


// Server setup
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`);
});
