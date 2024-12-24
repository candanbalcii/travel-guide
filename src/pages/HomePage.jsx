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
} from '@mui/material';
import Rating from '@mui/material/Rating';
import InfoIcon from '@mui/icons-material/Info';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { jwtDecode } from 'jwt-decode';

const HomePage = () => {
  const [attractions, setAttractions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);

  //token alıyoruz local storagedan
  useEffect(() => {
    const fetchedToken = localStorage.getItem('token');
    setToken(fetchedToken);
  }, []);

  // overpass api query
  const query = `
    [out:json];
    node["tourism"](39.6,32.5,40.1,33.0);
    out body;
  `;

  //query değiştiğinde api istek atar ve statei değştiri
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
              description: location.tags.description || 'no description',
              latitude: location.lat,
              longitude: location.lon,
            }));
          setAttractions(locations);
        } else {
          setError('verriler alınamadı.');
        }
      } catch (err) {
        setError('veriler alınırken hata oluştu.');
        console.error('veriler alınırken hata oluştu:', err);
      }
    };
    fetchAttractions();
  }, [query]);

  const customIcon = new L.Icon({
    iconUrl: '/images/pin.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  const handleSubmitReview = async () => {
    try {
      if (!selectedLocation) {
        setError('Select location');
        return;
      }

      if (!token) {
        setError('Please login');
        return;
      }

      if (!rating || !review) {
        setError('Star rating and comment fields are required');
        return;
      }

      const decodedToken = jwtDecode(token);
      const userId = decodedToken?.userId;
      if (!userId) {
        setError('User not found');
        return;
      }

      const formData = {
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
        rating,
        comment: review,
        user_id: userId,
      };

      const response = await axios.post(
        'http://localhost:5000/api/reviews',
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert('Comment send!');
    } catch (error) {
      console.error('Hata:', error.response?.data || error.message);
      setError('Error occured');
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', flexDirection: 'row' }}>
      {token ? (
        <MapContainer
          center={[39.9251, 32.8369]} // Ankara
          zoom={12}
          style={{ width: '70%' }}
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
      ) : (
        <div>Lütfen giriş yapın.</div>
      )}

      <Paper
        sx={{
          width: '30%',
          backgroundColor: '#f9f9f9',
          padding: '20px',
          overflowY: 'auto',
          boxShadow: 3,
          borderRadius: '8px',
          marginLeft: '20px',
        }}
      >
        {!selectedLocation ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '100%',
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
    </div>
  );
};

export default HomePage;
