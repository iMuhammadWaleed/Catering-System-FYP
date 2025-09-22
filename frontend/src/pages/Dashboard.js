import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Dashboard() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }

    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const res = await axios.get('/api/dashboard', {
            headers: {
              'x-auth-token': token
            }
          });
          setDashboardData(res.data);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data.');
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <div className="dashboard-container">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="dashboard-container error-message">{error}</div>;
  }

  return (
    <div className="dashboard-container">
      <h2>Welcome to your Dashboard, {user?.name}!</h2>
      {dashboardData ? (
        <div>
          <p>Your upcoming bookings: {dashboardData.bookingsCount}</p>
          {/* Display more dashboard specific data here */}
        </div>
      ) : (
        <p>No dashboard data available.</p>
      )}
      <button onClick={logout} className="btn-primary">Logout</button>
    </div>
  );
}

export default Dashboard;

