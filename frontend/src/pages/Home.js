import React from 'react';
import { Link } from 'react-router-dom';
import '../pages/Home.css';

function Home() {
  return (
    <div className="home-container">
      <header className="hero-section">
        <div className="hero-content">
          <h1>Your Event, Our Expertise</h1>
          <p>Discover the best caterers for any occasion.</p>
          <Link to="/caterers" className="btn-primary">Find Caterers</Link>
        </div>
      </header>

      <section className="features-section">
        <h2>Why Choose CaterPro?</h2>
        <div className="feature-list">
          <div className="feature-item">
            <h3>Wide Selection</h3>
            <p>Browse a diverse range of caterers offering various cuisines.</p>
          </div>
          <div className="feature-item">
            <h3>Easy Booking</h3>
            <p>Book your preferred caterer with just a few clicks.</p>
          </div>
          <div className="feature-item">
            <h3>Quality Assurance</h3>
            <p>Only top-rated and verified caterers are featured on our platform.</p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <h2>Ready to Plan Your Event?</h2>
        <p>Let CaterPro take the stress out of finding the perfect caterer.</p>
        <Link to="/caterers" className="btn-secondary">Get Started</Link>
      </section>
    </div>
  );
}

export default Home;

