import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await axios.get('/api/auth/me', {
            headers: {
              'x-auth-token': token
            }
          });
          setUser(res.data);
        } catch (err) {
          console.error('Error loading user:', err);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (email, password) => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    const body = JSON.stringify({ email, password });

    try {
      const res = await axios.post('/api/auth/login', body, config);
      localStorage.setItem('token', res.data.token);
      const userRes = await axios.get('/api/auth/me', {
        headers: {
          'x-auth-token': res.data.token
        }
      });
      setUser(userRes.data);
      return true;
    } catch (err) {
      console.error('Login failed:', err.response.data.msg);
      return false;
    }
  };

  const register = async (name, email, password) => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    const body = JSON.stringify({ name, email, password });

    try {
      const res = await axios.post('/api/auth/register', body, config);
      localStorage.setItem('token', res.data.token);
      const userRes = await axios.get('/api/auth/me', {
        headers: {
          'x-auth-token': res.data.token
        }
      });
      setUser(userRes.data);
      return true;
    } catch (err) {
      console.error('Registration failed:', err.response.data.msg);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);


