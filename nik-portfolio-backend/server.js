const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db'); // Import the MongoDB connection function

const app = express();

// Connect to MongoDB
connectDB(); // Call the connection function before starting the server

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', require('./routes/api'));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
