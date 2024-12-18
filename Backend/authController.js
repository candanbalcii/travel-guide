// authController.js
const bcrypt = require('bcryptjs');
const db = require('./dbConfig'); // Veritabanı bağlantısı
const jwt = require('jsonwebtoken');

exports.signup = (req, res) => {
  console.log('Signup endpoint hit'); // Bu log'un console'a yazılıp yazılmadığını kontrol edin.

  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error('Error hashing password:', err.message);
      return res.status(500).json({ error: 'Internal server error' });
    }

    const query =
      'INSERT INTO user (name, surname, email, password) VALUES (?, ?, ?, ?)';
    db.query(
      query,
      [firstName, lastName, email, hashedPassword],
      (err, results) => {
        if (err) {
          console.error('Error inserting user into database:', err.message);
          return res
            .status(500)
            .json({ error: 'Error inserting user into database' });
        }
        res.status(201).json({ message: 'User successfully created!' });
      }
    );
  });
};

// Login function (example)
exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const query = 'SELECT * FROM user WHERE email = ?';
  db.query(query, [email], (err, results) => {
    if (err) {
      console.error('Error checking user in database:', err.message);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (results.length === 0) {
      return res.status(400).json({ error: 'User not found' });
    }

    const user = results[0];
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.error('Error comparing passwords:', err.message);
        return res.status(500).json({ error: 'Internal server error' });
      }

      if (!isMatch) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign({ userId: user.id }, 'your_jwt_secret', {
        expiresIn: '1h',
      });
      res.status(200).json({ message: 'Login successful', token });
    });
  });
};
