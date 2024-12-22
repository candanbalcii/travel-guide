// reviewsController.js
const db = require('./dbConfig'); // Veritabanı bağlantısını kontrol et

exports.addReview = (req, res) => {
  const { latitude, longitude, rating, review } = req.body;

  if (!latitude || !longitude || !rating || !review) {
    return res.status(400).json({ error: 'Tüm alanlar doldurulmalıdır' });
  }

  const query = `
    INSERT INTO reviews (latitude, longitude, rating, comment) 
    VALUES (?, ?, ?, ?)
  `;

  db.query(query, [latitude, longitude, rating, review], (err, results) => {
    if (err) {
      console.error('Yorum eklenirken hata oluştu:', err.message);
      return res.status(500).json({ error: 'Yorum eklenirken hata oluştu' });
    }
    res.status(201).json({ message: 'Yorum başarıyla kaydedildi!' });
  });
};
