const express = require('express'); //express paketini içe aktarıyoruz nodejs ile web sunucuları oluşturmak için framweork
const bodyParser = require('body-parser'); // http isteği gövdesinde gelen verileri parse etmek için
const authRoutes = require('./authRoutes.js'); // /api yoluna gelen istekleri yönlendiren
const cors = require('cors'); // cors paketini içe aktar
const mysql = require('mysql');

const app = express(); //express uygulama nesnesi
app.use(cors()); // CORS'u tüm isteklere aç
app.use(express.json());

app.use('/api', authRoutes);

const port = 5000; // Portu burada tanımlayın
app.listen(port, () => {
  console.log(`Server ${port} portunda çalışıyor`);
});

// MySQL bağlantısı
const db = mysql.createConnection({
  host: 'localhost', // MySQL sunucusu
  user: 'root', // Veritabanı kullanıcı adı
  password: '', // Veritabanı şifresi
  database: 'travel', // Veritabanı adı
});

db.connect((err) => {
  if (err) {
    console.log('Veritabanına bağlanılamadı:', err);
  } else {
    console.log('Veritabanına başarıyla bağlanıldı!');
  }
});

app.use(cors());
app.use(express.json());

// Yorumları almak için API
app.get('/reviews/:locationId', (req, res) => {
  const locationId = req.params.locationId;
  const query =
    'SELECT * FROM reviews WHERE location_id = ? ORDER BY created_at DESC';
  db.query(query, [locationId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Yorum eklemek için API
app.post('/reviews', (req, res) => {
  const { locationId, userName, rating, reviewText } = req.body;
  const query =
    'INSERT INTO reviews (location_id, user_name, rating, review_text) VALUES (?, ?, ?, ?)';
  db.query(
    query,
    [locationId, userName, rating, reviewText],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ message: 'Yorum başarıyla eklendi!' });
    }
  );
});

// Sunucuyu başlatma
app.listen(port, () => {
  console.log(`Server ${port} portunda çalışıyor`);
});
