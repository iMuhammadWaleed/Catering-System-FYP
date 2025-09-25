import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about">
      <div className="container">
        <section className="about-hero">
          <h1>About CaterPro</h1>
          <p>Connecting food lovers with exceptional catering services</p>
        </section>

        <section className="about-content">
          <div className="about-section">
            <h2>Our Mission</h2>
            <p>
              At CaterPro, we believe that great food brings people together. Our mission is to 
              connect customers with the finest catering services in their area, making it easy 
              to find the perfect caterer for any occasion.
            </p>
          </div>

          <div className="about-section">
            <h2>What We Offer</h2>
            <div className="services-grid">
              <div className="service-item">
                <h3>For Customers</h3>
                <ul>
                  <li>Easy caterer discovery</li>
                  <li>Verified reviews and ratings</li>
                  <li>Secure booking system</li>
                  <li>24/7 customer support</li>
                </ul>
              </div>
              <div className="service-item">
                <h3>For Caterers</h3>
                <ul>
                  <li>Business profile management</li>
                  <li>Order management system</li>
                  <li>Customer communication tools</li>
                  <li>Analytics and insights</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="about-section">
            <h2>Why Choose Us</h2>
            <div className="features-list">
              <div className="feature-item">
                <h4>Quality Assurance</h4>
                <p>All caterers are thoroughly vetted and regularly reviewed</p>
              </div>
              <div className="feature-item">
                <h4>Wide Selection</h4>
                <p>From intimate gatherings to large corporate events</p>
              </div>
              <div className="feature-item">
                <h4>Transparent Pricing</h4>
                <p>No hidden fees, clear pricing for all services</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;

