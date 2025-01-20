require('dotenv').config()
const express = require('express');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const passport = require('./config/passport');
const mongoose = require('mongoose');

const homeRoutes = require('./routes/homeRoutes');
const apiRoutes = require('./routes/apiRoutes');
const authRoutes = require('./routes/authRoutes')
const {BASE_URL, FRONTEND_BASE_URL} = require('./utils')

const app = express();

const allowedOrigins = [`${BASE_URL}`, `${FRONTEND_BASE_URL}`];

// Static files
const isProduction = process.env.NODE_ENV === 'production';
isProduction ?
    app.use(express.static(path.join(__dirname, '../client/dist')))
    :
    app.use(express.static(path.join(__dirname, '../client/public')))

// Middleware
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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/', homeRoutes);
app.use('/api', apiRoutes);
app.use('/auth', authRoutes);

// Error handling
app.use((req, res, next) => {
    res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Server setup
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`);
});
