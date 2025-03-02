import React, { useState, useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from 'react-leaflet';
import axios from 'axios';
import {
  Box,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  Rating,
  Link,
  Modal,
  IconButton,
  Grid,
  Avatar,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';

const HomePage = () => {
  const [attractions, setAttractions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [image, setImage] = useState(null);
  const [trips, setTrips] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [openAlbumModal, setOpenAlbumModal] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [currentPhoto, setCurrentPhoto] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [likes, setLikes] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [bounds, setBounds] = useState(null); // Harita sınırları için state

  const navigate = useNavigate();

  //Harita hareket ettiğinde sınırları güncelle
  const MapEvents = () => {
    const map = useMapEvents({
      moveend: () => {
        const newBounds = map.getBounds();
        setBounds(newBounds);
      },
    });
    return null;
  };

  // Turistik yerleri çek
  useEffect(() => {
    const fetchAttractions = async () => {
      if (!bounds) return;

      const { _southWest, _northEast } = bounds;
      const query = `
        [out:json];
        node["tourism"](${_southWest.lat},${_southWest.lng},${_northEast.lat},${_northEast.lng});
        out body;
      `;

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
  }, [bounds]);

  const fetchReviews = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/reviews');
      console.log('Response data:', response.data);
      setReviews(response.data);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError('An error occurred while fetching reviews.');
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  useEffect(() => {
    // API'den trips verilerini çekme
    const fetchTrips = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/trips'); // Doğru endpoint
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('API response:', response.data); // API yanıtını konsola yazdır

        setTrips(data); // trips state'ini güncelle
      } catch (error) {
        console.error('Error fetching trips:', error);
      }
    };

    fetchTrips();
  }, []);

  const customIcon = new L.Icon({
    iconUrl: '/images/pin.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  const handleSubmitReview = async () => {
    if (!selectedLocation) {
      setError('Please select a location');
      return;
    }

    if (!rating || !review) {
      setError('Please fill in all fields');
      return;
    }

    const formData = new FormData();
    formData.append('latitude', selectedLocation.latitude);
    formData.append('longitude', selectedLocation.longitude);
    formData.append('rating', rating);
    formData.append('comment', review);
    formData.append('locationName', selectedLocation.name);
    if (image) {
      formData.append('image', image);
    }

    try {
      const response = await fetch('http://localhost:5000/api/reviews ', {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to submit review');
      }

      const result = await response.json();
      alert('Review submitted successfully!');
      setRating(0);
      setReview('');
      setImage(null);
      setError('');
      setSelectedLocation(null);

      navigate('/home');
    } catch (error) {
      console.error('Error submitting review:', error);
      setError('Error submitting review. Please try again.');
    }
  };

  return (
    <Box
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        background: 'linear-gradient(to right, #FF7F50, #00BFFF)',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          textAlign: 'center',
          marginTop: '20px',
          flex: 1,
        }}
      >
        <MapContainer
          center={[39.9, 32.9]}
          zoom={12}
          style={{ width: '100%', height: '60vh' }}
          scrollWheelZoom={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <MapEvents />
          {attractions.map((location) => (
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
          ))}
        </MapContainer>
      </div>

      {/*Review Form Kısmı */}
      {!selectedLocation ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(to right, #FF7F50, #00BFFF)',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
          }}
        >
          <InfoIcon
            sx={{
              mt: '30px',
              fontSize: '40px',
              marginBottom: '10px',
              color: '#fff',
            }}
          />
          <Typography variant="h6" gutterBottom sx={{ color: '#fff' }}>
            Select a location to leave a review
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            background: 'linear-gradient(to right, #FF7F50, #00BFFF)',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
          }}
        >
          {/* Selected Location Name */}
          <Typography
            variant="h5"
            gutterBottom
            sx={{ color: '#fff', fontWeight: 'bold' }}
          >
            Leave a Review and Rating for {selectedLocation.name}
          </Typography>

          {/*Star Rating */}
          <Box
            mb={2}
            sx={{
              backgroundColor: '#fff',
              padding: '16px',
              borderRadius: '8px',
            }}
          >
            <Typography
              variant="body1"
              gutterBottom
              sx={{ color: '#555', fontWeight: 'bold' }}
            >
              Star Rating
            </Typography>
            <Rating
              name="simple-controlled"
              value={rating}
              onChange={(_, newValue) => setRating(newValue)}
              precision={0.5}
              sx={{ fontSize: '32px' }}
            />
          </Box>

          {/* Review Comment*/}
          <Box
            mb={2}
            sx={{
              backgroundColor: '#fff',
              padding: '16px',
              borderRadius: '8px',
            }}
          >
            <TextField
              label="Your comment"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              value={review}
              onChange={(e) => setReview(e.target.value)}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#00BFFF',
                  },
                  '&:hover fieldset': {
                    borderColor: '#FF7F50',
                  },
                },
              }}
            />
          </Box>

          {/* Image Upload*/}
          <Box
            mb={2}
            sx={{
              backgroundColor: '#fff',
              padding: '16px',
              borderRadius: '8px',
            }}
          >
            <Card
              sx={{
                padding: '20px',
                borderRadius: '8px',
                backgroundColor: '#f5f5f5',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                textAlign: 'center',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.2)',
                },
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
                sx={{ color: '#555', fontWeight: 'bold' }}
              >
                Upload a Photo
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: '#777', marginBottom: '15px' }}
              >
                Add a photo to your review to make it more engaging.
              </Typography>
              <Button
                variant="contained"
                component="label"
                sx={{
                  backgroundColor: '#00BFFF',
                  color: '#fff',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 'bold',
                  transition: 'background-color 0.3s, transform 0.3s',
                  '&:hover': {
                    backgroundColor: '#FF7F50',
                    transform: 'scale(1.05)',
                  },
                }}
              >
                Choose File
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </Button>
              {image && (
                <Typography
                  variant="body2"
                  sx={{ marginTop: '10px', color: '#00BFFF' }}
                >
                  Selected File: {image.name}
                </Typography>
              )}
            </Card>
          </Box>

          {/* Submit Button */}
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmitReview}
            sx={{
              padding: '10px 20px',
              borderRadius: '8px',
              backgroundColor: '#00BFFF',
              color: '#fff',
              fontWeight: 'bold',
              transition: 'background-color 0.3s, transform 0.3s',
              '&:hover': {
                backgroundColor: '#FF7F50',
                transform: 'scale(1.05)',
              },
            }}
          >
            Submit Review
          </Button>

          {/* Error Message */}
          {error && (
            <Typography
              color="error"
              variant="body2"
              sx={{ mt: 2, color: '#fff' }}
            >
              {error}
            </Typography>
          )}

          {/* Previous Reviews */}
          <Box
            mt={4}
            sx={{
              backgroundColor: '#fff',
              padding: '16px',
              borderRadius: '8px',
            }}
          >
            <Typography
              variant="h6"
              gutterBottom
              sx={{ color: '#333', fontWeight: 'bold' }}
            >
              Previous Reviews for {selectedLocation.name}
            </Typography>
            {reviews
              .filter(
                (review) => review.location_name === selectedLocation.name
              )
              .map((review, index) => (
                <Box
                  key={index}
                  sx={{
                    mb: 3,
                    p: 2,
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    backgroundColor: '#f9f9f9',
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'scale(1.02)',
                      boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.2)',
                    },
                  }}
                >
                  {/* Review User Info */}
                  <Box display="flex" alignItems="center" mb={1}>
                    <Avatar
                      sx={{
                        width: 40,
                        height: 40,
                        marginRight: '10px',
                        backgroundColor: '#00BFFF',
                      }}
                    >
                      {review.user_name?.[0]}
                    </Avatar>
                    <Typography
                      variant="body1"
                      sx={{ fontWeight: 'bold', color: '#555' }}
                    >
                      {review.user_name} {review.user_surname}
                    </Typography>
                  </Box>

                  {/* Review Rating */}
                  <Box mb={1}>
                    <Rating
                      value={review.rating}
                      precision={0.5}
                      readOnly
                      sx={{ fontSize: '24px' }}
                    />
                  </Box>

                  {/* Review Comment */}
                  <Typography variant="body1" sx={{ mb: 1, color: '#555' }}>
                    {review.comment}
                  </Typography>

                  {/* Review Image */}
                  {review.image && (
                    <Box
                      sx={{
                        cursor: 'pointer',
                        '&:hover': {
                          opacity: 0.8,
                        },
                      }}
                      onClick={() => setCurrentPhoto(review.image)}
                    >
                      <img
                        src={`http://localhost:5000/uploads/${review.image}`}
                        alt="Review"
                        style={{
                          width: '100%',
                          maxWidth: '300px',
                          borderRadius: '8px',
                          marginTop: '10px',
                        }}
                      />
                    </Box>
                  )}
                </Box>
              ))}
            {reviews.filter(
              (review) => review.location_name === selectedLocation.name
            ).length === 0 && (
              <Typography variant="body1" color="textSecondary">
                No reviews yet. Be the first to leave one!
              </Typography>
            )}
          </Box>
        </Box>
      )}

      {/* Reviews from Users */}
      <Box
        sx={{
          marginTop: '20px',
          background: 'linear-gradient(to right, #FF7F50, #00BFFF)',
          padding: '40px 20px',
          borderRadius: '8px',
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gap: '40px',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            justifyItems: 'center',
            maxWidth: '1200px',
            margin: '0 auto',
          }}
        >
          {reviews
            .filter((review) => review.locationName === selectedLocation?.name)
            .map((review) => (
              <Card
                key={review.id}
                sx={{
                  boxShadow: 3,
                  borderRadius: '12px',
                  padding: '20px',
                  backgroundColor: '#fff',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'scale(1.03)',
                    boxShadow: 6,
                  },
                  width: '100%',
                  maxWidth: '350px',
                  border: '1px solid #eee',
                }}
              >
                <CardContent>
                  {/* Yer İsmi ve Yıldızlar */}
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 'bold',
                      color: '#FF7F50',
                      marginBottom: '10px',
                      textTransform: 'uppercase',
                    }}
                  >
                    {review.location_name}
                  </Typography>

                  {/* Kullanıcı Adı, Soyadı ve Avatar */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: '10px',
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 40,
                        height: 40,
                        marginRight: '10px',
                        backgroundColor: '#00BFFF',
                      }}
                    >
                      {review.user_name[0]} {/* Kullanıcı adının ilk harfi */}
                    </Avatar>

                    <Link
                      component={RouterLink}
                      to={`/profile/${review.user_id}`}
                      sx={{
                        textDecoration: 'none',
                        color: '#00BFFF',
                        fontWeight: 'bold',
                        '&:hover': {
                          color: '#FF7F50',
                        },
                      }}
                    >
                      {review.user_name} {review.user_surname}
                    </Link>
                  </Box>

                  {/* Yıldızlar */}
                  <Rating
                    name="read-only"
                    value={review.rating}
                    readOnly
                    sx={{ marginBottom: '10px', color: '#FFD700' }}
                  />

                  {/* Yorum */}
                  <Typography
                    variant="body2"
                    sx={{
                      marginBottom: '10px',
                      color: '#555',
                      lineHeight: '1.6',
                    }}
                  >
                    {review.comment}
                  </Typography>

                  {/* Yorum Fotoğrafı */}
                  {review.image && (
                    <Box
                      sx={{
                        cursor: 'pointer',
                        '&:hover': {
                          opacity: 0.8,
                        },
                      }}
                      onClick={() => setCurrentPhoto(review.image)}
                    >
                      <img
                        src={`http://localhost:5000/uploads/${review.image}`}
                        alt="Review"
                        style={{
                          width: '100%',
                          height: '200px',
                          objectFit: 'cover',
                          borderRadius: '8px',
                          marginTop: '10px',
                          border: '1px solid #eee',
                        }}
                      />
                    </Box>
                  )}

                  {/* Yorum Tarihi */}
                  <Typography
                    variant="body2"
                    sx={{
                      marginTop: '10px',
                      color: '#777',
                      fontSize: '0.875rem',
                    }}
                  >
                    {new Date(review.date).toLocaleDateString()}
                  </Typography>
                </CardContent>
              </Card>
            ))}
        </Box>
      </Box>

      {/* Fotoğraf Modalı */}
      <Modal
        open={Boolean(currentPhoto)}
        onClose={() => setCurrentPhoto(null)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            padding: '20px',
            borderRadius: '8px',
            outline: 'none',
            maxWidth: '90%',
            maxHeight: '90%',
            overflow: 'auto',
          }}
        >
          <IconButton
            sx={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              color: '#FF7F50',
            }}
            onClick={() => setCurrentPhoto(null)}
          >
            <CloseIcon />
          </IconButton>
          <img
            src={`http://localhost:5000/uploads/${currentPhoto}`}
            alt="Full Size"
            style={{
              width: '100%',
              height: 'auto',
              borderRadius: '8px',
            }}
          />
        </Box>
      </Modal>
    </Box>
  );
};

export default HomePage;
