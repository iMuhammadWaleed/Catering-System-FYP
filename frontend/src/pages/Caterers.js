import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../pages/Caterers.css';

function Caterers() {
  const [caterers, setCaterers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCaterers = async () => {
      try {
        const res = await axios.get('/api/caterers');
        setCaterers(res.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch caterers.');
        setLoading(false);
      }
    };

    fetchCaterers();
  }, []);

  if (loading) {
    return <div className="caterers-container">Loading caterers...</div>;
  }

  if (error) {
    return <div className="caterers-container error-message">{error}</div>;
  }

  return (
    <div className="caterers-container">
      <h2>Our Caterers</h2>
      <div className="caterers-list">
        {caterers.map((caterer) => (
          <div key={caterer._id} className="caterer-card">
            <img src={caterer.imageUrl} alt={caterer.name} className="caterer-image" />
            <h3>{caterer.name}</h3>
            <p>{caterer.description}</p>
            <p>Cuisine: {caterer.cuisine.join(', ')}</p>
            <p>Rating: {caterer.rating} ({caterer.reviews} reviews)</p>
            <Link to={`/caterers/${caterer._id}`} className="btn-primary">View Details</Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Caterers;

