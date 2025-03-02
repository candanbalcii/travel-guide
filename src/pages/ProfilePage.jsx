import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Typography,
  Avatar,
  Box,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  Rating,
  TextField,
  Button,
  IconButton,
  Slider,
  Paper,
  Modal,
} from '@mui/material';
import { format, isValid } from 'date-fns';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CloseIcon from '@mui/icons-material/Close';
import { useParams } from 'react-router-dom';

const Profile = () => {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [tabIndex, setTabIndex] = useState(0);
  const [albums, setAlbums] = useState([]);
  const [trips, setTrips] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState(null);
  const [openAlbumModal, setOpenAlbumModal] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [newAlbum, setNewAlbum] = useState({
    title: '',
    description: '',
    country: '',
    city: '',
    budget: 0,
    vacation_days: 7,
    photos: [],
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get(`http://localhost:5000/api/profile/${userId}`, {
        // URL'de userId kullan
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setProfile(response.data);
        setAlbums(response.data.albums || []);
      })
      .catch((err) => {
        console.error('Error fetching profile:', err.message);
        setError('Unable to fetch profile data');
      });
  }, [userId]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get(`http://localhost:5000/api/trips/${userId}`, {
        // URL'de userId kullan
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const parsedTrips = response.data.map((trip) => ({
          ...trip,
          photos: trip.photos ? JSON.parse(trip.photos) : [],
        }));
        setTrips(parsedTrips);
      })
      .catch((err) => {
        console.error('Error fetching profile:', err.message);
        setError('Unable to fetch profile data');
      });
  }, [userId]);

  const handleAlbumInputChange = (e) => {
    const { name, value } = e.target;
    setNewAlbum((prevAlbum) => ({
      ...prevAlbum,
      [name]:
        name === 'budget' || name === 'vacation_days' ? Number(value) : value,
    }));
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setNewAlbum((prevAlbum) => ({
      ...prevAlbum,
      photos: [...prevAlbum.photos, ...selectedFiles],
    }));
  };

  const handleRemovePhoto = (index) => {
    setNewAlbum((prevAlbum) => ({
      ...prevAlbum,
      photos: prevAlbum.photos.filter((_, i) => i !== index),
    }));
  };

  const handleAlbumSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', newAlbum.title);
    formData.append('description', newAlbum.description);
    formData.append('country', newAlbum.country);
    formData.append('city', newAlbum.city);
    formData.append('budget', newAlbum.budget);
    formData.append('vacation_days', newAlbum.vacation_days);

    newAlbum.photos.forEach((photo) => {
      formData.append('photos', photo);
    });

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/trips',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setAlbums([...albums, response.data]);
      setNewAlbum({
        title: '',
        description: '',
        country: '',
        city: '',
        budget: 0,
        vacation_days: 7,
        photos: [],
      });
    } catch (err) {
      console.error('Error adding album:', err);
    }
  };

  const handleAlbumClick = (album) => {
    setSelectedAlbum(album);
    setOpenAlbumModal(true);
  };

  const handlePhotoClick = (photo) => {
    setCurrentPhoto(photo);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setCurrentPhoto(null);
  };

  const handleCloseAlbumModal = () => {
    setOpenAlbumModal(false);
    setSelectedAlbum(null);
  };

  if (error) return <Typography>{error}</Typography>;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(to right, #FF7F50, #00BFFF)',
        padding: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {profile ? (
        <>
          <Avatar
            src={profile.user.avatar || '/default-avatar.png'}
            alt={`${profile.user.name} ${profile.user.surname}`}
            sx={{ width: 120, height: 120, mb: 2, border: '3px solid white' }}
          />
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white' }}>
            {profile.user.name} {profile.user.surname}
          </Typography>

          {/* Tablar */}
          <Tabs
            value={tabIndex}
            onChange={(event, newIndex) => setTabIndex(newIndex)}
            centered
            sx={{
              mt: 4,
              '& .MuiTab-root': {
                fontSize: '18px',
                fontWeight: 'bold',
                color: 'white',
                '&:hover': { color: '#FFD700' },
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#FFD700',
                height: '4px',
              },
            }}
          >
            <Tab label="Reviews" />
            <Tab label="Trips" />
          </Tabs>

          {tabIndex === 0 && (
            <Box mt={5} width="80%">
              <Typography variant="h6" sx={{ color: 'black' }}>
                Your Reviews:
              </Typography>
              <Grid container spacing={3} mt={2}>
                {Array.isArray(profile.reviews) &&
                profile.reviews.length > 0 ? (
                  profile.reviews.map((review, index) => {
                    const reviewDate = new Date(review.date);
                    const formattedDate = isValid(reviewDate)
                      ? format(reviewDate, 'MMM dd, yyyy')
                      : 'Date not available';
                    return (
                      <Grid item xs={12} md={6} key={index}>
                        <Card
                          sx={{
                            backgroundColor: '#fff',
                            padding: 1,
                            boxShadow: 4,
                            borderRadius: 3,
                            backdropFilter: 'blur(10px)',
                            transition: 'transform 0.3s, box-shadow 0.3s',
                            '&:hover': {
                              transform: 'scale(1.05)',
                              boxShadow: 6,
                            },
                            height: '90%', // Kartların yüksekliği sabit
                            display: 'flex',
                            flexDirection: 'column',
                          }}
                        >
                          <CardContent sx={{ flexGrow: 1 }}>
                            <Typography variant="h6" fontWeight="bold">
                              {review.location_name}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              {formattedDate}
                            </Typography>
                            <Box sx={{ mt: 1 }}>
                              <Rating value={review.rating} readOnly />
                            </Box>
                            <Typography variant="body1" sx={{ mt: 1 }}>
                              {review.comment}
                            </Typography>
                            {review.image && (
                              <Box sx={{ mt: 2, textAlign: 'center' }}>
                                <img
                                  src={`http://localhost:5000/uploads/${review.image}`}
                                  alt="Review"
                                  style={{
                                    width: '100%',
                                    height: '200px',
                                    objectFit: 'cover',
                                    borderRadius: '8px',
                                  }}
                                />
                              </Box>
                            )}
                            <Typography
                              variant="body2"
                              color="textSecondary"
                              sx={{ mt: 1 }}
                            >
                              Location: ({review.latitude}, {review.longitude})
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    );
                  })
                ) : (
                  <Typography>No reviews yet.</Typography>
                )}
              </Grid>
            </Box>
          )}

          {tabIndex === 1 && (
            <Box
              mt={3}
              width="80%"
              sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}
            >
              {/* Yeni Albüm Formu */}
              <Paper
                sx={{
                  width: '100%',
                  padding: '2rem',
                  borderRadius: '16px',
                  backgroundColor: 'ffff',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: 'black',
                    fontWeight: 'bold',
                    marginBottom: '1rem',
                  }}
                >
                  Create a New Trip Album:
                </Typography>

                <form onSubmit={handleAlbumSubmit}>
                  <TextField
                    fullWidth
                    label="Album Title"
                    name="title"
                    value={newAlbum.title}
                    onChange={handleAlbumInputChange}
                    required
                    sx={{ mb: 3 }}
                    placeholder="Enter a title for your trip"
                    InputLabelProps={{ style: { color: 'black' } }}
                    InputProps={{ style: { color: 'black' } }}
                  />

                  <TextField
                    fullWidth
                    label="Description"
                    name="description"
                    value={newAlbum.description}
                    onChange={handleAlbumInputChange}
                    multiline
                    rows={3}
                    sx={{ mb: 3 }}
                    placeholder="Describe your trip"
                    InputLabelProps={{ style: { color: 'black' } }}
                    InputProps={{ style: { color: 'black' } }}
                  />

                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Country Visited"
                        name="country"
                        value={newAlbum.country}
                        onChange={handleAlbumInputChange}
                        required
                        placeholder="Enter the country"
                        InputLabelProps={{ style: { color: 'black' } }}
                        InputProps={{ style: { color: 'black' } }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="City Visited"
                        name="city"
                        value={newAlbum.city}
                        onChange={handleAlbumInputChange}
                        required
                        placeholder="Enter the city"
                        InputLabelProps={{ style: { color: 'black' } }}
                        InputProps={{ style: { color: 'black' } }}
                      />
                    </Grid>
                  </Grid>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      width: '80%',
                      mt: 3,
                    }}
                  >
                    <Typography variant="h6" sx={{ color: 'black' }}>
                      Budget: ${newAlbum.budget}
                    </Typography>
                    <Slider
                      value={newAlbum.budget}
                      min={100}
                      max={5000}
                      step={100}
                      onChange={(e, newValue) =>
                        setNewAlbum((prev) => ({ ...prev, budget: newValue }))
                      }
                      valueLabelDisplay="auto"
                      valueLabelFormat={(value) => `$${value}`}
                      sx={{ width: '50%' }}
                    />
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      width: '80%',
                      mt: 3,
                    }}
                  >
                    <Typography variant="h6" sx={{ color: 'black' }}>
                      Vacation Days: {newAlbum.vacation_days} days
                    </Typography>
                    <Slider
                      value={newAlbum.vacation_days}
                      min={1}
                      max={30}
                      step={1}
                      onChange={(e, newValue) =>
                        setNewAlbum((prev) => ({
                          ...prev,
                          vacation_days: newValue,
                        }))
                      }
                      valueLabelDisplay="auto"
                      sx={{ width: '50%' }}
                    />
                  </Box>

                  <Box sx={{ mb: 3, mt: 2 }}>
                    <Typography variant="h6" sx={{ color: 'black' }}>
                      Upload your photos!
                    </Typography>
                    <input
                      accept="image/*"
                      multiple
                      type="file"
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                      id="photo-upload"
                    />
                    <label htmlFor="photo-upload">
                      <IconButton
                        color="primary"
                        component="span"
                        sx={{
                          backgroundColor: '#FFD700',
                          '&:hover': { backgroundColor: '#FFA500' },
                        }}
                      >
                        <AddPhotoAlternateIcon fontSize="large" />
                      </IconButton>
                    </label>
                  </Box>

                  <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                    {newAlbum.photos.map((photo, index) => (
                      <Grid item xs={6} sm={4} key={index}>
                        <Box sx={{ position: 'relative', mb: 2 }}>
                          <img
                            src={URL.createObjectURL(photo)}
                            alt={`Preview ${index}`}
                            style={{
                              width: '100%',
                              height: 'auto',
                              borderRadius: '8px',
                            }}
                          />
                          <IconButton
                            onClick={() => handleRemovePhoto(index)}
                            sx={{
                              position: 'absolute',
                              top: 0,
                              right: 0,
                              backgroundColor: 'rgba(0, 0, 0, 0.6)',
                              color: 'black',
                              borderRadius: '50%',
                              padding: '5px',
                              '&:hover': {
                                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                              },
                            }}
                          >
                            <Typography sx={{ color: 'black' }}>X</Typography>
                          </IconButton>
                        </Box>
                      </Grid>
                    ))}
                  </Box>

                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{
                      mt: 2,
                      backgroundColor: '#FF7F50',
                      '&:hover': { backgroundColor: '#FF6347' },
                      fontSize: '16px',
                      fontWeight: 'bold',
                      padding: '10px 20px',
                    }}
                  >
                    Save Album
                  </Button>
                </form>
              </Paper>

              {/* Albümler Listesi */}
              <Typography
                variant="h6"
                sx={{ color: 'black', fontWeight: 'bold' }}
              >
                Your Trip Albums:
              </Typography>
              <Grid container spacing={3} mt={2}>
                {trips.length > 0 ? (
                  trips.map((trip, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Card
                        sx={{
                          backgroundColor: '#ffff',
                          padding: 2,
                          boxShadow: 4,
                          borderRadius: 3,
                          backdropFilter: 'blur(10px)',
                          transition: 'transform 0.3s, box-shadow 0.3s',
                          '&:hover': {
                            transform: 'scale(1.05)',
                            boxShadow: 6,
                          },
                        }}
                      >
                        <CardContent>
                          <Typography
                            variant="h5"
                            fontWeight="bold"
                            onClick={() => handleAlbumClick(trip)}
                            sx={{
                              cursor: 'pointer',
                              fontSize: '1.2rem',
                              color: 'black',
                            }}
                          >
                            {trip.title}
                          </Typography>

                          <Typography
                            variant="body2"
                            sx={{ mt: 1, color: 'black' }}
                          >
                            📍 {trip.city}, {trip.country}
                          </Typography>

                          {trip.photos && trip.photos.length > 0 && (
                            <Box
                              sx={{
                                mt: 2,
                                position: 'relative',
                                width: '100%',
                                height: '200px', // Sabit yükseklik
                              }}
                            >
                              <img
                                src={`http://localhost:5000/uploads/trips/${trip.photos[0]}`}
                                alt="Trip Cover"
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover',
                                  borderRadius: '8px',
                                  cursor: 'pointer',
                                }}
                                onClick={() => handleAlbumClick(trip)}
                              />
                            </Box>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  ))
                ) : (
                  <Typography sx={{ color: 'black' }}>
                    No albums created yet.
                  </Typography>
                )}
              </Grid>
            </Box>
          )}
        </>
      ) : (
        <Typography variant="h6" sx={{ color: 'black' }}>
          Loading profile...
        </Typography>
      )}

      {/* Fotoğraf Modalı */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: '80%',
            maxWidth: '800px',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: '8px',
          }}
        >
          <IconButton
            onClick={handleCloseModal}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              color: 'text.primary',
            }}
          >
            <CloseIcon />
          </IconButton>
          <img
            src={`http://localhost:5000/uploads/trips/${currentPhoto}`}
            alt="Enlarged"
            style={{
              width: '100%',
              height: 'auto',
              borderRadius: '8px',
            }}
          />
        </Box>
      </Modal>

      {/* Albüm Modalı */}
      <Modal
        open={openAlbumModal}
        onClose={handleCloseAlbumModal}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: '80%',
            maxWidth: '800px',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: '8px',
          }}
        >
          <IconButton
            onClick={handleCloseAlbumModal}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              color: 'text.primary',
            }}
          >
            <CloseIcon />
          </IconButton>
          {selectedAlbum && (
            <>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
                {selectedAlbum.title}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {selectedAlbum.description}
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                📍 {selectedAlbum.city}, {selectedAlbum.country}
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                💰 Budget: ${selectedAlbum.budget || 0}
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                🏖️ Vacation Days: {selectedAlbum.vacation_days || 0}
              </Typography>
              <Grid container spacing={2}>
                {selectedAlbum.photos.map((photo, index) => (
                  <Grid item xs={6} sm={4} key={index}>
                    <img
                      src={`http://localhost:5000/uploads/trips/${photo}`}
                      alt={`Trip ${index + 1}`}
                      style={{
                        width: '100%',
                        height: 'auto',
                        borderRadius: '8px',
                        cursor: 'pointer',
                      }}
                      onClick={() => handlePhotoClick(photo)}
                    />
                  </Grid>
                ))}
              </Grid>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default Profile;
