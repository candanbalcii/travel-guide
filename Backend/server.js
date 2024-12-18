const express = require('express');
const cors = require('cors');
const app = express();
const authRoutes = require('./authRoutes');

app.use(cors()); // CORS middleware'i ekleyin
app.use(express.json()); // JSON işleme middleware'i ekleyin

app.use('/api', authRoutes); // API route'larını kullanın

app.listen(5000, () => {
  console.log('Server is running on http://localhost:5000');
});
