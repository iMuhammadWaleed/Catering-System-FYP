import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user, loading, isAuthenticated, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('profile');
  const [orders, setOrders] = useState([]);
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      // Fetch orders and reservations only if authenticated
      fetchOrders();
      fetchReservations();
    }
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    // Mock data for now
    setOrders([
      {
        id: 1,
        caterer: 'Gourmet Delights',
        date: '2024-01-15',
        status: 'Completed',
        total: 250.00,
        items: ['Italian Pasta', 'Caesar Salad', 'Tiramisu']
      },
      {
        id: 2,
        caterer: 'Spice Garden',
        date: '2024-01-20',
        status: 'Pending',
        total: 180.00,
        items: ['Chicken Curry', 'Basmati Rice', 'Naan Bread']
      }
    ]);
  };

  const fetchReservations = async () => {
    // Mock data for now
    setReservations([
      {
        id: 1,
        caterer: 'BBQ Masters',
        eventDate: '2024-02-10',
        eventTime: '18:00',
        guests: 50,
        status: 'Confirmed',
        location: 'Central Park, NYC'
      },
      {
        id: 2,
        caterer: 'Gourmet Delights',
        eventDate: '2024-02-25',
        eventTime: '12:00',
        guests: 25,
        status: 'Pending',
        location: 'Office Building, Manhattan'
      }
    ]);
  };

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="dashboard-error">
        <h2>Access Denied</h2>
        <p>Please log in to access your dashboard.</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {user.firstName}!</h1>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-sidebar">
          <div className="user-info">
            <div className="user-avatar">
              {user.firstName.charAt(0)}{user.lastName.charAt(0)}
            </div>
            <h3>{user.firstName} {user.lastName}</h3>
            <p>{user.email}</p>
            <span className="user-role">{user.role}</span>
          </div>

          <nav className="dashboard-nav">
            <button 
              className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              Profile
            </button>
            <button 
              className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              Order History
            </button>
            <button 
              className={`nav-item ${activeTab === 'reservations' ? 'active' : ''}`}
              onClick={() => setActiveTab('reservations')}
            >
              Reservations
            </button>
            <button 
              className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              Settings
            </button>
          </nav>
        </div>

        <div className="dashboard-main">
          {activeTab === 'profile' && (
            <div className="profile-section">
              <h2>Profile Information</h2>
              <div className="profile-card">
                <div className="profile-field">
                  <label>First Name</label>
                  <p>{user.firstName}</p>
                </div>
                <div className="profile-field">
                  <label>Last Name</label>
                  <p>{user.lastName}</p>
                </div>
                <div className="profile-field">
                  <label>Email</label>
                  <p>{user.email}</p>
                </div>
                <div className="profile-field">
                  <label>Phone</label>
                  <p>{user.phone || 'Not provided'}</p>
                </div>
                <div className="profile-field">
                  <label>Account Type</label>
                  <p className="capitalize">{user.role}</p>
                </div>
                <div className="profile-field">
                  <label>Member Since</label>
                  <p>{new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
                <button className="edit-profile-btn">Edit Profile</button>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="orders-section">
              <h2>Order History</h2>
              {orders.length === 0 ? (
                <div className="empty-state">
                  <p>No orders found. Start by browsing our caterers!</p>
                  <button className="browse-btn">Browse Caterers</button>
                </div>
              ) : (
                <div className="orders-list">
                  {orders.map(order => (
                    <div key={order.id} className="order-card">
                      <div className="order-header">
                        <h3>{order.caterer}</h3>
                        <span className={`status ${order.status.toLowerCase()}`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="order-details">
                        <p><strong>Date:</strong> {new Date(order.date).toLocaleDateString()}</p>
                        <p><strong>Total:</strong> ${order.total.toFixed(2)}</p>
                        <p><strong>Items:</strong> {order.items.join(', ')}</p>
                      </div>
                      <div className="order-actions">
                        <button className="view-details-btn">View Details</button>
                        {order.status === 'Completed' && (
                          <button className="reorder-btn">Reorder</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'reservations' && (
            <div className="reservations-section">
              <h2>Reservations</h2>
              {reservations.length === 0 ? (
                <div className="empty-state">
                  <p>No reservations found. Book your first catering event!</p>
                  <button className="book-btn">Book Now</button>
                </div>
              ) : (
                <div className="reservations-list">
                  {reservations.map(reservation => (
                    <div key={reservation.id} className="reservation-card">
                      <div className="reservation-header">
                        <h3>{reservation.caterer}</h3>
                        <span className={`status ${reservation.status.toLowerCase()}`}>
                          {reservation.status}
                        </span>
                      </div>
                      <div className="reservation-details">
                        <p><strong>Event Date:</strong> {new Date(reservation.eventDate).toLocaleDateString()}</p>
                        <p><strong>Time:</strong> {reservation.eventTime}</p>
                        <p><strong>Guests:</strong> {reservation.guests}</p>
                        <p><strong>Location:</strong> {reservation.location}</p>
                      </div>
                      <div className="reservation-actions">
                        <button className="view-details-btn">View Details</button>
                        {reservation.status === 'Pending' && (
                          <button className="cancel-btn">Cancel</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="settings-section">
              <h2>Account Settings</h2>
              <div className="settings-card">
                <div className="setting-item">
                  <h3>Change Password</h3>
                  <p>Update your account password</p>
                  <button className="setting-btn">Change Password</button>
                </div>
                <div className="setting-item">
                  <h3>Email Notifications</h3>
                  <p>Manage your email preferences</p>
                  <button className="setting-btn">Manage Notifications</button>
                </div>
                <div className="setting-item">
                  <h3>Privacy Settings</h3>
                  <p>Control your privacy and data settings</p>
                  <button className="setting-btn">Privacy Settings</button>
                </div>
                <div className="setting-item danger">
                  <h3>Delete Account</h3>
                  <p>Permanently delete your account and all data</p>
                  <button className="setting-btn danger">Delete Account</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

