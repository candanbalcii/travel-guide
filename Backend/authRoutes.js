//bu dosya API rotalarını tanımlıyor
const express = require('express');
const router = express.Router(); //router nesnesini oluşturduk, http isteklerini belirli yollar için yönlendirmeyi sağlar.
const authController = require('./authController.js');

router.post('/signup', authController.signup); //signup rotasına yapılan http post isteklerini fonksiyona yönlendiriyor, ve kullanıcı kayıt yapacak fonksiyonu çağırmış oluyor
router.post('/login', authController.login);

module.exports = router;
