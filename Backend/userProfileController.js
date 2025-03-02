const db = require('./dbConfig');

const getUserProfile = async (req, res) => {
  const requestedUserId = req.params.userId;

  const loggedInUserId = req.user.id;

  const userId = requestedUserId || loggedInUserId;

  try {
    const userQuery = 'SELECT id, name, surname, avatar FROM user WHERE id = ?';
    const [userResults] = await db.promise().query(userQuery, [userId]);

    if (userResults.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userResults[0];

    const reviewsQuery =
      'SELECT latitude, longitude, rating, comment, location_name, image FROM reviews WHERE user_id = ?';
    const [reviewsResults] = await db.promise().query(reviewsQuery, [userId]);

    const tripsQuery =
      'SELECT id, title, description, country, city, budget, vacation_days, photos FROM trips WHERE user_id = ?';
    const [tripsResults] = await db.promise().query(tripsQuery, [userId]);

    res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        surname: user.surname,
        avatar: user.avatar,
      },
      reviews: reviewsResults,
      trips: tripsResults.map((trip) => ({
        ...trip,
        photos: trip.photos ? JSON.parse(trip.photos) : [],
      })),
    });
  } catch (err) {
    console.error('Error fetching profile data:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getUserProfile };
