const multer = require('multer');
const path = require('path');
const db = require('./dbConfig');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/trips');
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

const getAllTrips = (req, res) => {
  const query = `
    SELECT 
      trips.*, 
      user.name AS user_name, 
      user.surname AS user_surname 
    FROM trips 
    JOIN user ON trips.user_id = user.id
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Database error:', err.message);
      return res
        .status(500)
        .json({ error: 'An error occurred while fetching all trips' });
    }

    res.status(200).json(results);
  });
};

const getTrips = (req, res) => {
  const loggedInUserId = req.user.id;
  const requestedUserId = req.params.userId;

  const userId = requestedUserId || loggedInUserId;

  const query = 'SELECT * FROM trips WHERE user_id = ?';

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Database error:', err.message);
      return res
        .status(500)
        .json({ error: 'An error occurred while fetching trips' });
    }

    res.status(200).json(results);
  });
};

const addTrip = (req, res) => {
  const { title, description, country, city, budget, vacation_days } = req.body;
  const userId = req.user.userId;

  if (
    !title ||
    !description ||
    !country ||
    !city ||
    !budget ||
    !vacation_days
  ) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (isNaN(budget) || isNaN(vacation_days)) {
    return res
      .status(400)
      .json({ error: 'Budget and vacation_days must be valid numbers' });
  }

  const images = req.files ? req.files.map((file) => file.filename) : null;

  const query =
    'INSERT INTO trips (title, description, user_id, date, photos, country, city, budget, vacation_days) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';

  db.query(
    query,
    [
      title,
      description,
      userId,
      new Date(),
      JSON.stringify(images),
      country,
      city,
      parseFloat(budget),
      parseInt(vacation_days),
    ],
    (err, results) => {
      if (err) {
        console.error('Error while adding trip to database:', err);
        return res
          .status(500)
          .json({ error: 'An error occurred while adding the trip' });
      }
      res.status(200).json({ message: 'Trip successfully added' });
    }
  );
};

module.exports = { getTrips, addTrip, getAllTrips, upload };
