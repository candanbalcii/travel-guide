const db = require('./dbConfig');

exports.getTripLikes = (req, res) => {
  const { tripId } = req.params;

  db.query(
    'SELECT COUNT(*) as likeCount FROM likes WHERE trip_id = ?',
    [tripId],
    (error, results) => {
      if (error) {
        console.error('Error fetching likes:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }

      const likeCount = results[0].likeCount || 0;
      res.status(200).json({ likeCount });
    }
  );
};
exports.addTripLike = (req, res) => {
  const { tripId } = req.params;
  const userId = req.user.userId;

  //Kullanıcı daha önce bu trip albumu beğenmiş mi kontrol edildi
  db.query(
    'SELECT * FROM likes WHERE trip_id = ? AND user_id = ?',
    [tripId, userId],
    (error, results) => {
      if (error) {
        console.error('Error checking existing like:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }

      if (results.length > 0) {
        console.log('User has already liked this trip.');
        return res
          .status(400)
          .json({ message: 'You have already liked this trip.' });
      }

      // Beğeniyi ekle
      db.query(
        'INSERT INTO likes (trip_id, user_id) VALUES (?, ?)',
        [tripId, userId],
        (error) => {
          if (error) {
            console.error('Error adding like:', error);
            return res.status(500).json({ error: 'Internal server error' });
          }

          console.log('Like added successfully.');
          res.status(200).json({ message: 'Like added successfully' });
        }
      );
    }
  );
};
