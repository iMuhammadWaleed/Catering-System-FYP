import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Caterers.css';

const Caterers = () => {
  const [caterers, setCaterers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCaterers();
  }, []);

  const fetchCaterers = async (query = '') => {
    setLoading(true);
    setError(null);
    try {
      const url = query 
        ? `https://5000-i5nw2hzkrsaktukmpgu90-7dfe04fe.manusvm.computer/api/caterers/search?query=${query}`
        : `https://5000-i5nw2hzkrsaktukmpgu90-7dfe04fe.manusvm.computer/api/caterers`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (response.ok && data.success) {
        setCaterers(data.data);
      } else {
        setError(data.message || 'Failed to fetch caterers');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Error fetching caterers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchCaterers(searchQuery);
  };

  if (loading) {
    return <div className="caterers-loading">Loading caterers...</div>;
  }

  if (error) {
    return <div className="caterers-error">Error: {error}</div>;
  }

  return (
    <div className="caterers">
      <div className="container">
        <h1>Find Your Perfect Caterer</h1>
        <div className="search-section">
          <input 
            type="text" 
            placeholder="Search by cuisine, location, or name..." 
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => { if (e.key === 'Enter') handleSearch(); }}
          />
          <button className="search-btn" onClick={handleSearch}>Search</button>
        </div>
        
        <div className="caterers-grid">
          {caterers.length === 0 ? (
            <p>No caterers found. Try a different search!</p>
          ) : (
            caterers.map(caterer => (
              <Link to={`/caterers/${caterer._id}`} key={caterer._id} className="caterer-card-link">
                <div className="caterer-card">
                  <div className="caterer-header">
                    <h3>{caterer.businessName}</h3>
                    <div className="rating">
                      <span className="stars">★★★★★</span>
                      <span className="rating-number">{caterer.rating || 'N/A'}</span>
                    </div>
                  </div>
                  <p className="cuisine">{caterer.specialties?.join(', ') || caterer.menuTypes?.join(', ') || 'Various Cuisines'}</p>
                  <p className="description">{caterer.location?.city || 'N/A'}, {caterer.location?.state || 'N/A'}</p>
                  <div className="caterer-footer">
                    <span className="min-order">Avg. Price: ${caterer.averagePrice || 'N/A'}</span>
                    <button className="contact-btn">View Details</button>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Caterers;


