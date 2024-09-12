const mysql = require('mysql2'); //mysql paketi yüklüyoruz nodejs uygulamamıza

//mysql veritabanına bağlanmak için bağlantı nesnesi
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'nadnacilcab024.',
  database: 'usability_testing_platform',
});

connection.connect((err) => {
  if (err) {
    console.error('Failed to connect database', err);
    return;
  }
  console.log('Connected to mysql database');
});

// Basit bir sorgu yaparak bağlantıyı test edin
connection.query('SELECT 1 + 1 AS result', (err, results) => {
  if (err) {
    console.error('Query error:', err.message);
    return;
  }
  console.log('Query result:', results);
});

module.exports = connection; //bağlantıyı diğer dosyalarda kullanmak için
