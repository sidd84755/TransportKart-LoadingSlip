const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Login endpoint
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Validate credentials against environment variables
  if (username !== process.env.AUTH_USERNAME || password !== process.env.AUTH_PASSWORD) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Generate JWT token
  const token = jwt.sign(
    { username },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({
    message: 'Login successful',
    token,
    user: { username }
  });
});

module.exports = router; 