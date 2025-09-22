import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import BookingForm from '../components/BookingForm';
import './CatererDetail.css';

function CatererDetail() {
  const { id } = useParams();
  const [caterer, setCaterer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCaterer = async () => {
      try {
        const res = await axios.get(`/api/caterers/${id}`);
        setCaterer(res.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch caterer details.');
        setLoading(false);
      }
    };

    fetchCaterer();
  }, [id]);

  if (loading) {
    return <div className="caterer-detail-container">Loading caterer details...</div>;
  }

  if (error) {
    return <div className="caterer-detail-container error-message">{error}</div>;
  }

  if (!caterer) {
    return <div className="caterer-detail-container error-message">Caterer not found.</div>;
  }

  return (
    <div className="caterer-detail-container">
      <h2>{caterer.name}</h2>
      <div className="caterer-detail-card">
        <img src={caterer.imageUrl} alt={caterer.name} className="caterer-detail-image" />
        <div className="caterer-info">
          <p><strong>Description:</strong> {caterer.description}</p>
          <p><strong>Contact:</strong> {caterer.contact}</p>
          <p><strong>Phone:</strong> {caterer.phone}</p>
          <p><strong>Address:</strong> {caterer.address}</p>
          <p><strong>Cuisine:</strong> {caterer.cuisine.join(', ')}</p>
          <p><strong>Guests:</strong> {caterer.minGuests} - {caterer.maxGuests}</p>
          <p><strong>Price per person:</strong> ${caterer.pricePerPerson}</p>
          <p><strong>Rating:</strong> {caterer.rating} ({caterer.reviews} reviews)</p>
        </div>
      </div>
      <div className="booking-section">
        <h3>Book {caterer.name}</h3>
        <BookingForm catererId={caterer._id} />
      </div>
    </div>
  );
}

export default CatererDetail;


