import React, { useEffect, useState } from 'react';
import './Home.css';

const Home = () => {
  const [backendStatus, setBackendStatus] = useState('Loading...');

  useEffect(() => {
    const fetchBackendStatus = async () => {
      try {
        const response = await fetch('https://5000-i5nw2hzkrsaktukmpgu90-7dfe04fe.manusvm.computer/health');
        const data = await response.json();
        setBackendStatus(`Backend Status: ${data.status}, DB: ${data.database.status}`);
      } catch (error) {
        setBackendStatus(`Backend Error: ${error.message}`);
      }
    };

    fetchBackendStatus();
  }, []);

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to CaterPro</h1>
          <p>Your premier catering management platform</p>
          <div className="status-indicator">
            <span className="status-text">{backendStatus}</span>
          </div>
          <div className="hero-buttons">
            <button className="btn btn-primary">Find Caterers</button>
            <button className="btn btn-secondary">Join as Caterer</button>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2>Why Choose CaterPro?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>Easy Booking</h3>
              <p>Book your perfect catering service with just a few clicks</p>
            </div>
            <div className="feature-card">
              <h3>Trusted Caterers</h3>
              <p>All our caterers are verified and highly rated by customers</p>
            </div>
            <div className="feature-card">
              <h3>Flexible Options</h3>
              <p>Choose from a wide variety of cuisines and service styles</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

