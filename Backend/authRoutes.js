const express = require('express');
const router = express.Router();
const authController = require('./authController');
const reviewsController = require('./reviewsController');
const verifyToken = require('./middlewares/verifyToken');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/reviews', reviewsController.getReviews);
router.post('/reviews', reviewsController.addReview);

module.exports = router;
