import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './BookingForm.css';

function BookingForm({ catererId }) {
  const { user } = useAuth();
  const [eventDate, setEventDate] = useState('');
  const [numGuests, setNumGuests] = useState('');
  const [message, setMessage] = useState('');
  const [bookingStatus, setBookingStatus] = useState(null); // 'success' or 'error'

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBookingStatus(null);

    if (!user) {
      setBookingStatus('error');
      setMessage('Please log in to make a booking.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        '/api/bookings', // Assuming a /api/bookings endpoint
        { caterer: catererId, user: user._id, eventDate, numGuests, message },
        {
          headers: {
            'x-auth-token': token,
            'Content-Type': 'application/json',
          },
        }
      );
      setBookingStatus('success');
      setMessage('Booking request sent successfully!');
      setEventDate('');
      setNumGuests('');
      setMessage('');
    } catch (err) {
      console.error('Booking error:', err);
      setBookingStatus('error');
      setMessage('Failed to send booking request. Please try again.');
    }
  };

  return (
    <div className="booking-form-container">
      <h4>Make a Booking Request</h4>
      <form onSubmit={handleSubmit} className="booking-form">
        <div className="form-group">
          <label htmlFor="eventDate">Event Date:</label>
          <input
            type="date"
            id="eventDate"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="numGuests">Number of Guests:</label>
          <input
            type="number"
            id="numGuests"
            value={numGuests}
            onChange={(e) => setNumGuests(e.target.value)}
            min="1"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="message">Message (optional):</label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows="4"
          ></textarea>
        </div>
        <button type="submit" className="btn-primary" disabled={!user}>
          {user ? 'Submit Booking' : 'Login to Book'}
        </button>
      </form>
      {bookingStatus === 'success' && (
        <p className="booking-success-message">{message}</p>
      )}
      {bookingStatus === 'error' && (
        <p className="booking-error-message">{message}</p>
      )}
    </div>
  );
}

export default BookingForm;


