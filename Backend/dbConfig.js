//dbConfig.js
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Gokcen7578.*',
  database: 'travel',
});

connection.connect((err) => {
  if (err) {
    console.error('Failed to connect to database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

module.exports = connection;
