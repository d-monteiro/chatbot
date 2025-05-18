const express = require('express');
const {
  register,
  login,
  getMe,
  logout
} = require('./auth');

const router = express.Router();

const { protect } = require('./middleware');
const User = require('./user');

// Match the routes with the frontend API calls
router.post('/v1/auth/register', register);
router.post('/v1/auth/login', login);
router.get('/v1/auth/me', protect, getMe);
router.get('/v1/auth/logout', protect, logout);

// Add to your routes.js (REMOVE THIS IN PRODUCTION!)
router.get('/v1/auth/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;