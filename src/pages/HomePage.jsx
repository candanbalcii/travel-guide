import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  TextField,
  Button,
  Rating,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import { Info as InfoIcon } from '@mui/icons-material';
import axios from 'axios';

const MapComponent = ({ attractions, setAttractions }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmitReview = async () => {
    if (!selectedLocation) return;

    setLoading(true);
    try {
      const response = await axios.post(`http://localhost:5000/reviews`, {
        locationId: selectedLocation.id,
        rating,
        review,
      });
      alert('Yorum başarıyla gönderildi!');
      setRating(0);
      setReview('');
    } catch (err) {
      setError('Yorum gönderilirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <MapContainer
        center={[39.9251, 32.8369]}
        zoom={12}
        style={{ width: '70%' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {attractions.map((location) => (
          <Marker
            key={location.id}
            position={[location.latitude, location.longitude]}
            eventHandlers={{
              click: () => setSelectedLocation(location),
            }}
          >
            <Popup>{location.name}</Popup>
          </Marker>
        ))}
      </MapContainer>

      <div
        style={{
          width: '30%',
          backgroundColor: '#f9f9f9',
          padding: '20px',
          overflowY: 'auto',
          position: 'relative',
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
              textAlign: 'center',
              color: '#3f51b5',
              border: '2px dashed #3f51b5',
              borderRadius: '10px',
              padding: '20px',
            }}
          >
            <InfoIcon sx={{ fontSize: '40px', marginBottom: '10px' }} />
            <Typography variant="h6" gutterBottom>
              Yorum yapmak için bir konum seçin
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Harita üzerinde bir mekana tıkladığınızda, yorum yapabilirsiniz.
            </Typography>
          </Box>
        ) : (
          <div>
            <Typography variant="h5" gutterBottom>
              {selectedLocation.name} İçin Yorum ve Puan Ver
            </Typography>

            <Typography variant="body1" color="textSecondary" paragraph>
              {selectedLocation.description}
            </Typography>

            <Box mb={2}>
              <Typography variant="body1" gutterBottom>
                Yıldız Puanı
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
                label="Yorumunuz"
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
            >
              {loading ? <CircularProgress size={24} /> : 'Gönder'}
            </Button>

            {error && (
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const HomePage = () => {
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [attractions, setAttractions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get('http://localhost:5000/countries');
        setCountries(response.data);
      } catch (error) {
        setError('Ülkeler alınırken bir hata oluştu.');
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    const fetchCities = async () => {
      if (!selectedCountry) return;

      try {
        const response = await axios.get(
          `http://localhost:5000/cities/${selectedCountry}`
        );
        setCities(response.data);
      } catch (error) {
        setError('Şehirler alınırken bir hata oluştu.');
      }
    };

    fetchCities();
  }, [selectedCountry]);

  useEffect(() => {
    const fetchAttractions = async () => {
      if (!selectedCity) return;

      try {
        const response = await axios.get(
          `http://localhost:5000/attractions/${selectedCity}`
        );
        setAttractions(response.data);
      } catch (error) {
        setError('Mekanlar alınırken bir hata oluştu.');
      }
    };

    fetchAttractions();
  }, [selectedCity]);

  return (
    <div>
      <h1>Turistik Mekanları Keşfedin</h1>

      <select
        onChange={(e) => setSelectedCountry(e.target.value)}
        value={selectedCountry}
      >
        <option value="">Ülke Seçin</option>
        {countries.map((country) => (
          <option key={country.id} value={country.id}>
            {country.name}
          </option>
        ))}
      </select>

      <select
        onChange={(e) => setSelectedCity(e.target.value)}
        value={selectedCity}
        disabled={!selectedCountry}
      >
        <option value="">Şehir Seçin</option>
        {cities.map((city) => (
          <option key={city.id} value={city.id}>
            {city.name}
          </option>
        ))}
      </select>

      <MapComponent attractions={attractions} setAttractions={setAttractions} />

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default HomePage;
