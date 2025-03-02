const multer = require('multer');
const path = require('path');
const db = require('./dbConfig');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

const getReviews = (req, res) => {
  const query = `
    SELECT 
      reviews.*, 
      user.name AS user_name, 
      user.surname AS user_surname 
    FROM 
      reviews 
    INNER JOIN 
      user ON reviews.user_id = user.id;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Database error:', err.message);
      console.error('SQL query:', query);
      return res
        .status(500)
        .json({ error: 'An error occurred while fetching reviews' });
    }
    console.log('Query results:', results);

    res.status(200).json(results);
  });
};

const addReview = (req, res) => {
  const { latitude, longitude, rating, comment, locationName } = req.body;
  const userId = req.user.userId;

  if (!latitude || !longitude || !rating || !comment || !locationName) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const image = req.file ? req.file.filename : null;

  const query =
    'INSERT INTO reviews (latitude, longitude, rating, comment, location_name, user_id, image) VALUES (?, ?, ?, ?, ?, ?, ?)';

  db.query(
    query,
    [latitude, longitude, rating, comment, locationName, userId, image],
    (err, results) => {
      if (err) {
        console.error('Error while adding review to database:', err.message);
        return res
          .status(500)
          .json({ error: 'An error occurred while adding the review' });
      }

      res.status(200).json({ message: 'Review successfully added' });
    }
  );
};

module.exports = { getReviews, addReview, upload };
