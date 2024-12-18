// authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('./authController');

// Define routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);

// Export the router
module.exports = router;
