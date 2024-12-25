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

app.use(cors({ origin: 'http://localhost:3000' }));

app.use('/api', authRoutes);

app.listen(5000, () => {
  console.log('Server is running on http://localhost:5000');
});
