const db = require('./dbConfig');

exports.addReview = (req, res) => {
  const { latitude, longitude, rating, comment } = req.body;
  const userId = req.user.id;

  if (!latitude || !longitude || !rating || !comment || !userId) {
    return res.status(400).json({ error: 'Tüm alanlar gereklidir' });
  }

  const query =
    'INSERT INTO reviews (latitude, longitude, rating, comment, user_id) VALUES (?, ?, ?, ?, ?)';
  db.query(
    query,
    [latitude, longitude, rating, comment, userId],
    (err, results) => {
      if (err) {
        console.error('Veritabanına yorum eklerken hata:', err.message);
        return res
          .status(500)
          .json({ error: 'Yorum eklenirken bir hata oluştu' });
      }
      res.status(200).json({ message: 'Yorum başarıyla eklendi' });
    }
  );
};
