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

// app.use((req, res, next) => {
//   console.log('Session data:', req.session);
//   next();
// });

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
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true, // Allow cookies and credentials
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
  console.log("typeof", typeof RedisStore)

redisClient.on('error', (err) => console.error('Redis Client Error:', err));

(async () => {
  try {
    await redisClient.connect();
    console.log("typeof", typeof RedisStore)
    await redisClient.set('foo', 'barasd');
    const result = await redisClient.get('foo');
    console.log(process.env.NODE_ENV === 'production');
    console.log(result)  // >>> bar
    console.log('Redis connected successfully');
  } catch (err) {
    console.error('Redis connection failed:', err);
  }
})();

app.use(
  session({
    store: redisStore,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  })
);

// app.use((req, res, next) => {
//   console.log('Session data3:', req.session);
//   next();
// });

// Passport middleware
app.use(passport.initialize());
// app.use((req, res, next) => {
//   console.log('Session data4:', req.session);
//   next();
// });
app.use(passport.session());
// app.use((req, res, next) => {
//   console.log('Session dat5:', req.session);
//   next();
// });

// Routes
app.use('/api', apiRoutes);
// app.use((req, res, next) => {
//   console.log('Session dat6:', req.session);
//   next();
// });
app.use('/auth', authRoutes);
// app.use((req, res, next) => {
//   console.log('Session dat7:', req.session);
//   next();
// });

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
    // console.log("wtf")
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
