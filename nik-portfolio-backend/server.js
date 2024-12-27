const express = require('express');
const cors = require('cors');
const connectDB = require('./db');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

// Handle Root
app.get('/', (req, res) => {
    res.send('Backend is running!');
});

// Export as a module
module.exports = app;
