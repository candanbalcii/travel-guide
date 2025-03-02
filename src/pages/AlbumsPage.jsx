import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Modal,
  IconButton,
  Avatar,
  Button,
  Fab,
} from '@mui/material';
import axios from 'axios';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const AlbumsPage = () => {
  const navigate = useNavigate();
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/trips');
        const albumsWithLikes = await Promise.all(
          response.data.map(async (album) => {
            try {
              const likesResponse = await axios.get(
                `http://localhost:5000/api/likes/trips/${album.id}`
              );
              return { ...album, likeCount: likesResponse.data.likeCount };
            } catch (error) {
              console.error('Error fetching likes:', error);
              return { ...album, likeCount: 0 };
            }
          })
        );
        setAlbums(albumsWithLikes);
        setLoading(false);
      } catch (err) {
        setError('Albümler yüklenirken bir hata oluştu.');
        setLoading(false);
        console.error('Error fetching albums:', err);
      }
    };

    fetchAlbums();
  }, []);

  const handleLikeTrip = async (tripId) => {
    try {
      await axios.post(
        `http://localhost:5000/api/likes/trips/${tripId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      // Beğeni sayısını güncelle
      const updatedAlbums = albums.map((album) =>
        album.id === tripId
          ? { ...album, likeCount: album.likeCount + 1 }
          : album
      );
      setAlbums(updatedAlbums);
    } catch (error) {
      console.error('Error liking trip:', error);
    }
  };

  // Diğer fonksiyonlar...
  const handleOpenModal = (album) => {
    setSelectedAlbum(album);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedAlbum(null);
    setSelectedImage(null);
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const handleProfileClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  const handleCreateAlbum = () => {
    navigate('/profile/trips');
  };

  if (loading) {
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}
      >
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        background: 'linear-gradient(to right, #FF7F50, #00BFFF)',
      }}
    >
      <Box
        sx={{
          width: '100%',
          height: '400px',
          overflow: 'hidden',
          borderRadius: '8px',
          background: 'linear-gradient(to right, #FF7F50, #00BFFF)',
        }}
      >
        <img
          src="/images/albums.png"
          alt="Header Image"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
      </Box>
      <Box>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 'bold',
            color: '#4b53af',
            display: 'flex',
            justifyContent: 'center',
            fontFamily: '"Pacifico", cursive',
            mt: '30px',
          }}
        >
          ALBUMS
        </Typography>{' '}
        <Typography
          variant="body1"
          sx={{
            color: '#666',
            fontStyle: 'italic',
            display: 'flex',
            justifyContent: 'center',
            fontFamily: '"Pacifico", cursive',
            mb: '50px ',
          }}
        >
          Explore the adventures and journeys of others !
        </Typography>
      </Box>
      <Grid
        container
        spacing={10}
        justifyContent="center"
        sx={{
          background: 'linear-gradient(to right, #FF7F50, #00BFFF)',
        }}
      >
        {albums.map((album) => (
          <Grid item xs={12} sm={6} md={4} key={album.id}>
            <Card
              sx={{
                backgroundColor: '#ffda8d',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                borderRadius: '12px',
                padding: '10px',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
                },
                cursor: 'pointer',
                border: '1px solid #ddd',
              }}
              onClick={() => handleOpenModal(album)}
            >
              <CardContent
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '10px !important',
                }}
              >
                {/* Albüm kapak fotoğrafı */}
                {album.photos &&
                  JSON.parse(album.photos || '[]').length > 0 && (
                    <Box
                      sx={{
                        width: '100%',
                        border: '8px solid #fff',
                        borderBottom: '40px solid #fff',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                        borderRadius: '4px',
                        overflow: 'hidden',
                        backgroundColor: '#fff',
                      }}
                    >
                      <img
                        src={`http://localhost:5000/uploads/trips/${
                          JSON.parse(album.photos)[0]
                        }`}
                        alt="Album Cover"
                        style={{
                          width: '100%',
                          height: '200px',
                          objectFit: 'cover',
                          display: 'block',
                        }}
                      />
                    </Box>
                  )}

                {/* Albüm başlığı */}
                <Typography
                  variant="h6"
                  sx={{
                    marginTop: '10px',
                    textAlign: 'center',
                    color: '#333',
                    fontFamily: '"Pacifico", cursive',
                  }}
                >
                  {album.title}
                </Typography>

                {/* Albüm konumu */}
                <Typography
                  variant="body2"
                  sx={{
                    textAlign: 'center',
                    color: '#666',
                    fontFamily: '"Pacifico", cursive',
                  }}
                >
                  📍 {album.city}, {album.country}
                </Typography>

                {/* Beğeni butonu ve sayısı */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    marginTop: '10px',
                  }}
                >
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLikeTrip(album.id);
                    }}
                  >
                    <FavoriteBorderIcon sx={{ color: '#00BFFF' }} />
                  </IconButton>
                  <Typography
                    sx={{
                      color: '#4b53af',
                      fontWeight: 'bold',
                    }}
                  >
                    {album.likeCount} Beğeni
                  </Typography>
                </Box>
                {/* Kullanıcı bilgileri */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    marginTop: '10px',
                  }}
                >
                  <Avatar
                    sx={{
                      width: 30,
                      height: 30,
                      marginRight: '8px',
                      backgroundColor: '#4b53af',
                      cursor: 'pointer',
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleProfileClick(album.user_id);
                    }}
                  >
                    {album.user_name?.[0]}
                  </Avatar>
                  <Typography
                    sx={{
                      color: '#4b53af',
                      fontWeight: 'bold',
                      fontFamily: '"Pacifico", cursive',
                      cursor: 'pointer',
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleProfileClick(album.user_id);
                    }}
                  >
                    {album.user_name} {album.user_surname}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Yeni Albüm Oluşturma Butonu */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          backgroundColor: '#00BFFF',
          '&:hover': { backgroundColor: '#009ACD' },
        }}
        onClick={handleCreateAlbum}
      >
        <AddIcon />
        <Typography
          variant="body2"
          sx={{
            marginLeft: '8px',
            display: { xs: 'none', sm: 'block' },
          }}
        ></Typography>
      </Fab>

      {/* Albüm Detay Modalı */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80%',
            maxWidth: '800px',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: '12px',
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
          {selectedAlbum && (
            <>
              {/* Kullanıcı bilgileri */}
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
                    cursor: 'pointer',
                  }}
                  onClick={() => handleProfileClick(selectedAlbum.user_id)}
                >
                  {selectedAlbum.user_name?.[0]}
                </Avatar>
                <Typography
                  sx={{
                    color: '#00BFFF',
                    fontWeight: 'bold',
                    fontFamily: '"Pacifico", cursive',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                  onClick={() => handleProfileClick(selectedAlbum.user_id)}
                >
                  {selectedAlbum.user_name} {selectedAlbum.user_surname}
                </Typography>
              </Box>

              {/* Albüm başlığı */}
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 'bold',
                  mb: 2,
                  fontFamily: '"Pacifico", cursive',
                }}
              >
                {selectedAlbum.title}
              </Typography>

              {/* Albüm açıklaması */}
              <Typography
                variant="body1"
                sx={{ mb: 2, fontFamily: '"Pacifico", cursive' }}
              >
                {selectedAlbum.description}
              </Typography>

              {/* Albüm konumu */}
              <Typography
                variant="body2"
                sx={{ mb: 2, fontFamily: '"Pacifico", cursive' }}
              >
                📍 {selectedAlbum.city}, {selectedAlbum.country}
              </Typography>

              {/* Albüm bütçe ve tatil günleri */}
              <Typography
                variant="body2"
                sx={{ mb: 2, fontFamily: '"Pacifico", cursive' }}
              >
                💰 Bütçe: {selectedAlbum.budget || 'N/A'} ₺
              </Typography>
              <Typography
                variant="body2"
                sx={{ mb: 2, fontFamily: '"Pacifico", cursive' }}
              >
                🏖️ Tatil Günü: {selectedAlbum.vacation_days || 'N/A'} gün
              </Typography>

              {/* Albüm fotoğrafları */}
              <Grid container spacing={2}>
                {(selectedAlbum.photos && Array.isArray(selectedAlbum.photos)
                  ? selectedAlbum.photos
                  : JSON.parse(selectedAlbum.photos || '[]')
                ).map((photo, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Box
                      sx={{
                        width: '100%',
                        border: '4px solid #000',
                        borderRadius: '4px',
                        overflow: 'hidden',
                        cursor: 'pointer',
                      }}
                      onClick={() => handleImageClick(photo)}
                    >
                      <img
                        src={`http://localhost:5000/uploads/trips/${photo}`}
                        alt={`Album Photo ${index + 1}`}
                        style={{
                          width: '100%',
                          height: 'auto',
                          display: 'block',
                        }}
                      />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </>
          )}
        </Box>
      </Modal>

      {/* Büyütülen Resim Modalı */}
      <Modal
        open={Boolean(selectedImage)}
        onClose={() => setSelectedImage(null)}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 2,
            borderRadius: '12px',
            outline: 'none',
          }}
        >
          <IconButton
            onClick={() => setSelectedImage(null)}
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
            src={`http://localhost:5000/uploads/trips/${selectedImage}`}
            alt="Full Size"
            style={{
              maxWidth: '90vw',
              maxHeight: '90vh',
              display: 'block',
            }}
          />
        </Box>
      </Modal>
    </Box>
  );
};

export default AlbumsPage;
