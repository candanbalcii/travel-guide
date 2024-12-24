const express = require('express');
const router = express.Router();
const authController = require('./authController');
const reviewsController = require('./reviewsController');
const verifyToken = require('./middlewares/verifyToken'); // Middleware'i import et

// Kullanıcı kayıt ve giriş route'ları
router.post('/signup', authController.signup); // Kullanıcı kaydı
router.post('/login', authController.login); // Kullanıcı girişi

// Yorum ekleme route'u, token doğrulaması ile
router.post('/reviews', verifyToken, reviewsController.addReview); // Yorum ekleme, auth kontrolü ile

// Router'ı dışa aktar
module.exports = router;
