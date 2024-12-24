import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { TextField, Button, Rating, Typography, Box } from '@mui/material';
import { Info as InfoIcon } from '@mui/icons-material';

const MapComponent = ({ attractions, setAttractions }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Harita */}
      <MapContainer
        center={[39.9251, 32.8369]}
        zoom={12}
        style={{ width: '70%' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* Konumlar */}
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

      {/*form*/}
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
              Yorum görmek için bir konum seçin
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Harita üzerinde bir mekana tıkladığınızda, o mekan hakkında yorum
              yapabilirsiniz.
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

            <Button variant="contained" color="primary" fullWidth>
              Send
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapComponent;
