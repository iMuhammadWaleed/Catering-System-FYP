import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './CatererDetail.css';

const CatererDetail = () => {
  const { id } = useParams();
  const [caterer, setCaterer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCaterer = async () => {
      try {
        const response = await fetch(`https://5000-i5nw2hzkrsaktukmpgu90-7dfe04fe.manusvm.computer/api/caterers/${id}`);
        const data = await response.json();

        if (response.ok && data.success) {
          setCaterer(data.data);
        } else {
          setError(data.message || 'Failed to fetch caterer details');
        }
      } catch (err) {
        setError('Network error. Please try again.');
        console.error('Error fetching caterer details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCaterer();
  }, [id]);

  if (loading) {
    return <div className="caterer-detail-loading">Loading caterer details...</div>;
  }

  if (error) {
    return <div className="caterer-detail-error">Error: {error}</div>;
  }

  if (!caterer) {
    return <div className="caterer-detail-not-found">Caterer not found.</div>;
  }

  return (
    <div className="caterer-detail-page">
      <div className="caterer-detail-container">
        <div className="caterer-header">
          <h1>{caterer.businessName}</h1>
          <p className="caterer-rating">⭐ {caterer.rating || 'N/A'} ({caterer.reviewsCount || 0} reviews)</p>
        </div>

        <div className="caterer-info-grid">
          <div className="info-card">
            <h3>Contact Information</h3>
            <p><strong>Contact Person:</strong> {caterer.contactPerson}</p>
            <p><strong>Email:</strong> {caterer.email}</p>
            <p><strong>Phone:</strong> {caterer.phone}</p>
          </div>

          <div className="info-card">
            <h3>Location & Service Area</h3>
            <p><strong>City:</strong> {caterer.location?.city || 'N/A'}</p>
            <p><strong>State:</strong> {caterer.location?.state || 'N/A'}</p>
            <p><strong>Zip Code:</strong> {caterer.location?.zipCode || 'N/A'}</p>
            <p><strong>Service Radius:</strong> {caterer.serviceRadius || 'N/A'} miles</p>
          </div>

          <div className="info-card">
            <h3>Cuisine & Specialties</h3>
            <p><strong>Cuisines:</strong> {caterer.menuTypes?.join(', ') || 'N/A'}</p>
            <p><strong>Specialties:</strong> {caterer.specialties?.join(', ') || 'N/A'}</p>
            <p><strong>Dietary Options:</strong> {caterer.dietaryOptions?.join(', ') || 'N/A'}</p>
          </div>

          <div className="info-card">
            <h3>Pricing & Minimums</h3>
            <p><strong>Average Price:</strong> ${caterer.averagePrice || 'N/A'} per person</p>
            <p><strong>Minimum Order:</strong> ${caterer.minOrder || 'N/A'}</p>
            <p><strong>Minimum Guests:</strong> {caterer.minGuests || 'N/A'}</p>
          </div>
        </div>

        <div className="caterer-description">
          <h2>About {caterer.businessName}</h2>
          <p>{caterer.description || 'No description provided.'}</p>
        </div>

        {caterer.menu && caterer.menu.length > 0 && (
          <div className="caterer-menu">
            <h2>Our Menu Highlights</h2>
            <div className="menu-items-grid">
              {caterer.menu.map((item, index) => (
                <div key={index} className="menu-item-card">
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <p className="menu-item-price">${item.price.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {caterer.occasionTypes && caterer.occasionTypes.length > 0 && (
          <div className="caterer-occasions">
            <h2>Occasions We Cater</h2>
            <div className="occasion-tags">
              {caterer.occasionTypes.map((occasion, index) => (
                <span key={index} className="occasion-tag">{occasion}</span>
              ))}
            </div>
          </div>
        )}

        <div className="caterer-actions">
          <button className="book-now-btn">Book Now</button>
          <button className="contact-btn">Contact {caterer.contactPerson}</button>
        </div>
      </div>
    </div>
  );
};

export default CatererDetail;

