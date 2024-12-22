// authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('./authController');
const reviewsController = require('./reviewsController');

// Define routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/reviews', reviewsController.addReview);

// Export the router
module.exports = router;
