const jwt = require('jsonwebtoken');

//token doğrulama middleware
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
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Token doğrulama hatası:', err);
    return res.status(401).json({ error: 'Geçersiz token.' });
  }
};

module.exports = verifyToken;