// authController.js

const bcrypt = require('bcryptjs');
const db = require('./dbConfig');
const jwt = require('jsonwebtoken');
exports.signup = (req, res) => {
  const { email, password, role, company_name } = req.body;

  // Eğer role "owner" ise, company_name zorunlu
  if (role === 'owner' && !company_name) {
    return res
      .status(400)
      .json({ error: 'Company name is required for owner' });
  }

  // Şifreyi hashle
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error('Hashing error:', err.message);
      return res.status(500).json({ error: 'Hashing error' });
    }

    const query =
      'INSERT INTO users (email, password, role, company_name) VALUES (?, ?, ?, ?)';
    db.query(
      query,
      [email, hashedPassword, role, company_name || null], // Eğer owner değilse company_name null
      (err, results) => {
        if (err) {
          console.error('Database insertion error:', err.message);
          return res.status(500).json({ error: 'Database insertion error' });
        }
        res.status(201).json({ message: 'User created successfully' });
      }
    );
  });
};

const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret';

exports.login = (req, res) => {
  const { email, password } = req.body;
  const trimmedEmail = email.trim();

  console.log('Email received:', email);

  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [trimmedEmail], (err, results) => {
    if (err) {
      console.error('Database query error:', err.message);
      return res.status(500).json({ error: 'Database query error' });
    }

    console.log('Query results:', results);

    if (results.length === 0) {
      console.log('No users found with email:', trimmedEmail);
      return res.status(401).json({ message: 'Invalid credentials' });
    } else {
      const user = results[0];
      console.log('User retrieved:', user);

      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          console.error('Comparison error:', err.message);
          return res.status(500).json({ error: 'Comparison error' });
        }

        console.log('Password comparison result:', result);

        if (result) {
          const token = jwt.sign(
            { userId: user.id, role: user.role },
            jwtSecret,
            { expiresIn: '1h' }
          );
          return res.status(200).json({
            message: 'Login successful!',
            token,
            user: {
              id: user.id,
              email: user.email,
              role: user.role,
              companyName: user.company_name || null,
            },
          });
        } else {
          return res.status(401).json({ message: 'Invalid credentials' });
        }
      });
    }
  });
};
