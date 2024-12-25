// reviewsController.js
const db = require('./dbConfig'); // Eğer veritabanı bağlantısı buradaysa

const getReviews = (req, res) => {
  const query = 'SELECT * FROM reviews'; // Burada veritabanından yorumları çekiyoruz
  db.query(query, (err, results) => {
    if (err) {
      console.error('Veritabanı hatası:', err.message);
      return res.status(500).json({ error: 'Yorumlar alınırken hata oluştu' });
    }
    res.status(200).json(results); // Veritabanından çekilen yorumları döndürüyoruz
  });
};

const addReview = (req, res) => {
  const { latitude, longitude, rating, comment } = req.body;

  if (!latitude || !longitude || !rating || !comment) {
    return res.status(400).json({ error: 'Tüm alanlar gereklidir' });
  }

  const query =
    'INSERT INTO reviews (latitude, longitude, rating, comment) VALUES (?, ?, ?, ?)';
  db.query(query, [latitude, longitude, rating, comment], (err, results) => {
    if (err) {
      console.error('Veritabanına yorum eklerken hata:', err.message);
      return res
        .status(500)
        .json({ error: 'Yorum eklenirken bir hata oluştu' });
    }
    res.status(200).json({ message: 'Yorum başarıyla eklendi' });
  });
};

module.exports = { getReviews, addReview };
