import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const UserProfile = () => {
  const { userId } = useParams();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `http://localhost:5000/api/user/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUserProfile(response.data);
      } catch (err) {
        setError('Unable to fetch user profile.');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>
        {userProfile.user.name} {userProfile.user.surname}
      </h1>
      <img
        src={userProfile.user.avatar || '/default-avatar.png'}
        alt={`${userProfile.user.name} ${userProfile.user.surname}`}
      />
      <h2>Reviews</h2>
      {userProfile.reviews.map((review, index) => (
        <div key={index}>
          <h3>{review.location_name}</h3>
          <p>{review.comment}</p>
          {review.image && (
            <img
              src={`http://localhost:5000/uploads/${review.image}`}
              alt="Review"
            />
          )}
        </div>
      ))}
      <h2>Trips</h2>
      {userProfile.trips.map((trip, index) => (
        <div key={index}>
          <h3>{trip.title}</h3>
          <p>{trip.description}</p>
          {trip.photos && (
            <img
              src={`http://localhost:5000/uploads/trips/${trip.photos[0]}`}
              alt="Trip"
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default UserProfile;
