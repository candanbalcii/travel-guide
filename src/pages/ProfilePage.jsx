import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Rating,
  Grid,
  Avatar,
  Paper,
  Button,
  Divider,
} from '@mui/material';

const ProfilePage = () => {
  // Örnek statik kullanıcı ve yorum verisi
  const userData = [
    {
      review_id: 1,
      rating: 4.5,
      review: 'Harika bir yer! Çok beğendim.',
      attraction_name: 'Eiffel Kulesi',
      description:
        "Paris'in simgelerinden biri olan bu kuleyi görmek inanılmaz bir deneyim.",
      latitude: 48.8584,
      longitude: 2.2945,
      photos: [
        { id: 1, file_path: '/images/photo1.jpg' },
        { id: 2, file_path: '/images/photo2.jpg' },
      ],
    },
    {
      review_id: 2,
      rating: 3.0,
      review: 'Ortalama bir deneyim.',
      attraction_name: 'Louvre Müzesi',
      description: 'Müze büyük ama bazı bölümleri kalabalıktı.',
      latitude: 48.8606,
      longitude: 2.3376,
      photos: [{ id: 1, file_path: '/images/photo3.jpg' }],
    },
  ];

  return (
    <Box sx={{ padding: 4 }}>
      {/* Profil Başlığı */}
      <Typography variant="h4" gutterBottom>
        Profilim
      </Typography>

      {/* Kullanıcı Bilgileri */}
      <Paper sx={{ padding: 3, marginBottom: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Avatar
              sx={{ width: 100, height: 100 }}
              alt="User Avatar"
              src="/images/user-avatar.jpg"
            />
          </Grid>
          <Grid item xs>
            <Typography variant="h5">John Doe</Typography>
            <Typography variant="body1" color="textSecondary">
              Kullanıcı Bilgileri
            </Typography>
            <Typography variant="body2" color="textSecondary">
              E-posta: johndoe@example.com
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Konum: Paris, Fransa
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Kullanıcının Gittiği Yerler ve Puanladığı Yerler */}
      <Typography variant="h6" gutterBottom>
        Gittiğiniz ve Puanladığınız Yerler
      </Typography>

      {userData.length === 0 ? (
        <Typography variant="body1" color="textSecondary">
          Henüz bir yer puanlamadınız.
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {userData.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.review_id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {item.attraction_name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {item.description}
                  </Typography>
                  <Rating
                    value={item.rating}
                    readOnly
                    precision={0.5}
                    sx={{ marginTop: 1 }}
                  />
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    paragraph
                    sx={{ marginTop: 1 }}
                  >
                    {item.review}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ marginBottom: 1 }}
                  >
                    {`Konum: ${item.latitude}, ${item.longitude}`}
                  </Typography>

                  {/* Fotoğraf Bölümü */}
                  {item.photos && item.photos.length > 0 && (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                      {item.photos.map((photo) => (
                        <img
                          key={photo.id}
                          src={photo.file_path}
                          alt={`photo-${photo.id}`}
                          style={{
                            width: '48%',
                            margin: '1%',
                            borderRadius: '8px',
                            objectFit: 'cover',
                            height: '120px',
                          }}
                        />
                      ))}
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Profil Düzenle Butonu */}
      <Box sx={{ marginTop: 4 }}>
        <Button variant="contained" color="primary" sx={{ width: '100%' }}>
          Profil Düzenle
        </Button>
      </Box>
    </Box>
  );
};

export default ProfilePage;
