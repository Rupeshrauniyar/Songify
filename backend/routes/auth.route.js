const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/Authenticate');
const { register, login, logout, getCurrentUser } = require('../controllers/auth.controller');


// Register new user
router.post('/register', register);

// Login user 
router.post('/login', login);

// Logout user 
router.post('/logout', logout);

// Get current user
router.get('/me', authenticate, getCurrentUser);

// Validate token
router.get('/validate', authenticate, (req, res) => {
  res.status(200).json({ user: req.user });
});

module.exports = router;

