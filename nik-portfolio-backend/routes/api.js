const express = require('express');
const router = express.Router();

// Example API Endpoint 

router.get('/', (req, res) => {
    res.json({ message: 'Welcome to the backend API!' });
});

module.exports = router;