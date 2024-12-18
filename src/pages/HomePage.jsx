import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import axios from 'axios';
import { Box, Typography, Button, CircularProgress, TextField } from '@mui/material';
import Rating from '@mui/material/Rating';
import InfoIcon from '@mui/icons-material/Info';
import L from 'leaflet'; // leaflet'i import etmeniz gerekebilir
import 'leaflet/dist/leaflet.css';

const HomePage = () => {
  const [attractions, setAttractions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Overpass API için sorgu
  const query = `
    [out:json];
    node["tourism"](39.6,32.5,40.1,33.0);
    out body;
  `;

  useEffect(() => {
    const fetchAttractions = async () => {
      try {
        const response = await axios.get(
          'https://overpass-api.de/api/interpreter?data=' + encodeURIComponent(query)
        );

        if (response.data && response.data.elements) {
          const locations = response.data.elements.filter(location => 
            location.lat !== undefined && location.lon !== undefined // Verilerin doğru formatta olduğundan emin ol
          ).map(location => ({
            id: location.id,
            name: location.tags.name,
            description: location.tags.description || "Açıklama yok",
            latitude: location.lat,
            longitude: location.lon,
          }));
          
          setAttractions(locations); // Attractions verisini state'e kaydediyoruz
        } else {
          setError('Veriler alınamadı.');
        }
      } catch (err) {
        setError('Veriler alınırken hata oluştu.');
        console.error('Veriler alınırken hata oluştu:', err);
      }
    };

    fetchAttractions();
  }, [query]); // query değişkenine bağlı olarak efekt tetiklenir

  const handleSubmitReview = async () => {
    if (!selectedLocation) return;

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/reviews', {
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

  // Özel ikonunuzu buraya ekleyin
  const customIcon = new L.Icon({
    iconUrl: '/images/pin.png', // Buraya özel ikonun yolunu koyun
    iconSize: [32, 32], // İkonun boyutları
    iconAnchor: [16, 32], // İkonun yerleşimi
    popupAnchor: [0, -32], // Popup'un yerleşimi
  });

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <MapContainer
        center={[39.9251, 32.8369]} // Başlangıç noktası (Ankara, Türkiye)
        zoom={12}
        style={{ width: '70%' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        
        {attractions.length > 0 ? (
          attractions.map((location) => (
            <Marker
              key={location.id}
              position={[location.latitude, location.longitude]}
              icon={customIcon} // Özel ikonu burada kullanıyoruz
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

export default HomePage;
