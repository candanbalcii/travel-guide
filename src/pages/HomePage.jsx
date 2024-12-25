import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import axios from 'axios';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  TextField,
  Paper,
  Card,
  CardContent,
  Rating,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const HomePage = () => {
  const [attractions, setAttractions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);

  // Overpass API query
  const query = `
    [out:json];
    node["tourism"](39.6,32.5,40.1,33.0);
    out body;
  `;

  // Fetch attractions data
  useEffect(() => {
    const fetchAttractions = async () => {
      try {
        const response = await axios.get(
          'https://overpass-api.de/api/interpreter?data=' +
            encodeURIComponent(query)
        );
        if (response.data && response.data.elements) {
          const locations = response.data.elements
            .filter(
              (location) =>
                location.lat !== undefined && location.lon !== undefined
            )
            .map((location) => ({
              id: location.id,
              name: location.tags.name,
              description: location.tags.description || 'No description',
              latitude: location.lat,
              longitude: location.lon,
            }));
          setAttractions(locations);
        } else {
          setError('Could not fetch attractions.');
        }
      } catch (err) {
        setError('An error occurred while fetching attractions.');
        console.error('Error:', err);
      }
    };
    fetchAttractions();
  }, [query]);

  // Fetch reviews from the server
  const fetchReviews = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/reviews');
      setReviews(response.data);
    } catch (err) {
      setError('An error occurred while fetching reviews.');
      console.error('Error:', err);
    }
  };

  // Load reviews on component mount
  useEffect(() => {
    fetchReviews();
  }, []);

  const customIcon = new L.Icon({
    iconUrl: '/images/pin.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  const handleSubmitReview = async () => {
    try {
      if (!selectedLocation) {
        setError('Please select a location.');
        return;
      }

      if (!rating || !review) {
        setError('Star rating and comment fields are required.');
        return;
      }

      const formData = {
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
        rating,
        comment: review,
        locationName: selectedLocation.name,
      };

      const response = await axios.post(
        'http://localhost:5000/api/reviews',
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      setReview('');
      setRating(0);
      setSelectedLocation(null);
      setReviews((prevReviews) => [
        ...prevReviews,
        { ...formData, id: Date.now() }, // Adding new review
      ]);

      alert('Comment sent!');
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
      setError('An error occurred while submitting the review.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Navbar */}
      <Box sx={{ marginBottom: '20px' }}>{/* Navbar content here */}</Box>

      {/* Map Area */}
      <MapContainer
        center={[39.9251, 32.8369]}
        zoom={12}
        style={{ width: '100%', height: '50vh' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {attractions.length > 0 ? (
          attractions.map((location) => (
            <Marker
              key={location.id}
              position={[location.latitude, location.longitude]}
              icon={customIcon}
              eventHandlers={{
                click: () => setSelectedLocation(location),
              }}
            >
              <Popup>{location.name}</Popup>
            </Marker>
          ))
        ) : (
          <div>No attractions available</div>
        )}
      </MapContainer>

      {/* Reviews and Review Form Section */}
      <Box
        sx={{
          padding: '20px',
          marginTop: '20px',
          overflowY: 'auto',
          flex: 1, // This ensures it fills the remaining space
        }}
      >
        <Paper
          sx={{
            backgroundColor: '#f9f9f9',
            padding: '20px',
            boxShadow: 3,
            borderRadius: '8px',
            marginBottom: '20px',
          }}
        >
          {!selectedLocation ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <InfoIcon sx={{ fontSize: '40px', marginBottom: '10px' }} />
              <Typography variant="h6" gutterBottom>
                Select a location to leave a review
              </Typography>
            </Box>
          ) : (
            <div>
              <Typography variant="h5" gutterBottom>
                Leave a Review and Rating for {selectedLocation.name}
              </Typography>
              <Box mb={2}>
                <Typography variant="body1" gutterBottom>
                  Star Rating
                </Typography>
                <Rating
                  name="simple-controlled"
                  value={rating}
                  onChange={(_, newValue) => setRating(newValue)}
                  precision={0.5}
                />
              </Box>
              <Box mb={2}>
                <TextField
                  label="Your comment"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={4}
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  sx={{ mb: 2 }}
                />
              </Box>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleSubmitReview}
                disabled={loading}
                sx={{ padding: '10px', borderRadius: '8px' }}
              >
                {loading ? <CircularProgress size={24} /> : 'Send'}
              </Button>
              {error && (
                <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                  {error}
                </Typography>
              )}
            </div>
          )}
        </Paper>

        {/* Reviews from Users */}
        <Box sx={{ marginTop: '20px' }}>
          <Typography variant="h5" gutterBottom>
            Reviews from Users
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gap: '15px',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            }}
          >
            {reviews.map((review) => (
              <Card key={review.id} sx={{ boxShadow: 3, borderRadius: '8px' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {review.locationName} - Rating: {review.rating}⭐
                  </Typography>
                  <Typography variant="body2">{review.comment}</Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default HomePage;
