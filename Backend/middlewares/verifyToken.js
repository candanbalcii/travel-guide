const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res
      .status(401)
      .json({ error: 'Access Denied. Authorization header is missing.' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access Denied. Token is missing.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log('Decoded Token:', decoded);
    req.user = decoded; // User bilgilerini req.user olarak ekledim
  } catch (err) {
    console.error('Token doğrulama hatası:', err);
    return res.status(401).json({ error: 'Geçersiz token.' });
  }
};

module.exports = verifyToken;
