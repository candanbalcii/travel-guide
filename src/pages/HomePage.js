import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MapComponent from '../components/MapComponent'; // Harita bileşenini dışarıdan alıyoruz.

const HomePage = () => {
  const [attractions, setAttractions] = useState([
    {
      id: 1,
      name: 'Anıtkabir',
      description:
        'Mustafa Kemal Atatürk’ün anıt mezarı ve Türkiye Cumhuriyeti’nin simgesi.',
      latitude: 39.9251,
      longitude: 32.8369,
      reviews: [],
    },
    {
      id: 2,
      name: 'Kocatepe Camii',
      description: 'Ankara’nın en büyük camisi ve mimari bir şaheser.',
      latitude: 39.9207,
      longitude: 32.8541,
      reviews: [],
    },
    {
      id: 3,
      name: 'Atakule',
      description: 'Ankara’nın ünlü gözlem kulesi ve alışveriş merkezi.',
      latitude: 39.8883,
      longitude: 32.8571,
      reviews: [],
    },
    {
      id: 4,
      name: 'Ankara Kalesi',
      description: 'Ankara’nın tarihini yansıtan eşsiz bir kale.',
      latitude: 39.941,
      longitude: 32.865,
      reviews: [],
    },
    {
      id: 5,
      name: 'Etnografya Müzesi',
      description: 'Türkiye’nin zengin kültürel mirasını sergileyen bir müze.',
      latitude: 39.9333,
      longitude: 32.8578,
      reviews: [],
    },
  ]);
  const [error, setError] = useState(null); // Hata mesajlarını tutmak için state

  // Yorumları al
  const fetchReviews = async (locationId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/reviews/${locationId}`
      );
      setAttractions((prevAttractions) =>
        prevAttractions.map((attraction) =>
          attraction.id === locationId
            ? { ...attraction, reviews: response.data }
            : attraction
        )
      );
    } catch (error) {
      setError('Yorumlar alınırken bir hata oluştu.');
    }
  };

  // Yorum ekle
  const addReview = async (locationId, userName, rating, reviewText) => {
    try {
      await axios.post('http://localhost:5000/reviews', {
        locationId,
        userName,
        rating,
        reviewText,
      });
      // Yorum eklendikten sonra mevcut yorumları yeniden yükle
      fetchReviews(locationId);
    } catch (error) {
      setError('Yorum eklenirken bir hata oluştu.');
    }
  };

  // Sayfa yüklendiğinde mekanları al ve sabit verilerle birleştir
  useEffect(() => {
    const fetchAttractions = async () => {
      try {
        const response = await axios.get('http://localhost:5000/reviews'); // Mekanları almak için endpoint
        setAttractions(response.data);
      } catch (error) {
        setError('Mekanlar alınırken bir hata oluştu');
      }
    };

    fetchAttractions();
  }, []);

  return (
    <div>
      <h1>Ankara’nın Turistik Mekanları</h1>
      {/* MapComponent'e attractions ve setAttractions propslarını geçiriyoruz */}
      <MapComponent attractions={attractions} setAttractions={setAttractions} />

      {/* Hata mesajı varsa göster */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Mekanların yorumlarını listeleme */}
      <div>
        {attractions.map((attraction) => (
          <div key={attraction.id}>
            <h2>{attraction.name}</h2>
            <p>{attraction.description}</p>
            <h3>Yorumlar:</h3>
            <ul>
              {attraction.reviews?.map((review) => (
                <li key={review.id}>
                  <strong>{review.user_name}</strong> - {review.rating} Puan
                  <p>{review.review_text}</p>
                  <small>{new Date(review.created_at).toLocaleString()}</small>
                </li>
              ))}
            </ul>
            {/* Yorum eklemek için form */}
            <div>
              <h4>Yorum Yaz</h4>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const userName = e.target.userName.value;
                  const rating = e.target.rating.value;
                  const reviewText = e.target.reviewText.value;
                  addReview(attraction.id, userName, rating, reviewText);
                }}
              >
                <input
                  type="text"
                  name="userName"
                  placeholder="Adınız"
                  required
                />
                <input
                  type="number"
                  name="rating"
                  placeholder="Puan (1-5)"
                  min="1"
                  max="5"
                  required
                />
                <textarea name="reviewText" placeholder="Yorumunuz" required />
                <button type="submit">Yorum Ekle</button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
