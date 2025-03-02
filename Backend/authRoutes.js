const express = require('express');
const router = express.Router();
const authController = require('./authController');
const reviewsController = require('./reviewsController');
const userProfileController = require('./userProfileController');
const tripController = require('./tripController');
const likesController = require('./likesController');

const db = require('./dbConfig');

const verifyToken = require('./middlewares/verifyToken');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/reviews', reviewsController.getReviews);
router.get('/trips', tripController.getAllTrips);

router.post(
  '/reviews',
  verifyToken,
  reviewsController.upload.single('image'),
  reviewsController.addReview
);
router.post(
  '/trips',
  verifyToken,
  tripController.upload.array('photos'),
  tripController.addTrip
);

router.get('/profile', verifyToken, userProfileController.getUserProfile);
router.get(
  '/profile/:userId',
  verifyToken,
  userProfileController.getUserProfile
);
router.get('/trips/:userId', verifyToken, tripController.getTrips);
router.get('/likes/trips/:tripId', likesController.getTripLikes);
router.post('/likes/trips/:tripId', verifyToken, likesController.addTripLike);

module.exports = router;
