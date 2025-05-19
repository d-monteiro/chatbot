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
router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/logout', protect, logout);

module.exports = router;