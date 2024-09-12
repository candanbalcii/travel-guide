const express = require('express'); //express paketini içe aktarıyoruz nodejs ile web sunucuları oluşturmak için framweork
const bodyParser = require('body-parser'); // http isteği gövdesinde gelen verileri parse etmek için
const authRoutes = require('./authRoutes.js'); // /api yoluna gelen istekleri yönlendiren
const cors = require('cors'); // cors paketini içe aktar

const app = express(); //express uygulama nesnesi
app.use(cors()); // CORS'u tüm isteklere aç
app.use(express.json());

app.use('/api', authRoutes);

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
