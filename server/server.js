const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config()

const homeRoutes = require('./routes/homeRoutes');
const apiRoutes = require('./routes/apiRoutes');

const app = express();

console.log(`Hello from server.js`)

// Static files
const isProduction = process.env.NODE_ENV === 'production';
isProduction ?
    app.use(express.static(path.join(__dirname, '../client/dist')))
    :
    app.use(express.static(path.join(__dirname, '../client/public')))

// Middleware
app.use(cors())
app.use(express.json());

// Routes
app.use('/', homeRoutes);
app.use('/api', apiRoutes);

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
