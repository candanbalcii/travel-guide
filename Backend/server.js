const express = require('express');
const cors = require('cors');
const app = express();
const authRoutes = require('./authRoutes');
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'nadnacilcab024.',
  database: 'travel',
});

app.use(express.json());
// CORS middleware'ini yalnızca bir kez ekleyin
app.use(cors({ origin: 'http://localhost:3000' }));

app.use(express.json()); // JSON işleme middleware'i ekleyin

// API route'larını kullanın
app.use('/api', authRoutes);

app.post('/api/reviews', (req, res) => {
  const { latitude, longitude, rating, review, locationName } = req.body;

  // Verilerin eksik olup olmadığını kontrol etme
  if (!latitude || !longitude || !rating || !review || !locationName) {
    return res.status(400).json({ error: 'Tüm alanlar doldurulmalıdır' });
  }

  // Rating değerinin geçerli olup olmadığını kontrol etme
  if (rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Puan 1 ile 5 arasında olmalıdır' });
  }

  // SQL sorgusu
  const query =
    'INSERT INTO reviews (latitude, longitude, rating, review, location_name) VALUES (?, ?, ?, ?, ?)';

  // Veritabanına veri ekleme
  db.query(
    query,
    [latitude, longitude, rating, review, locationName],
    (err, results) => {
      if (err) {
        console.error('Yorum eklenirken hata oluştu:', err);
        return res.status(500).json({ error: 'Yorum eklenirken hata oluştu' });
      }
      res.status(201).json({ message: 'Yorum başarıyla kaydedildi!' });
    }
  );
});

app.listen(5000, () => {
  console.log('Server is running on http://localhost:5000');
});
