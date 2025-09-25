import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Caterers from './pages/Caterers';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CatererDetail from './pages/CatererDetail'; // Import the new CatererDetail component
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/caterers" element={<Caterers />} />
          <Route path="/caterers/:id" element={<CatererDetail />} /> {/* Add route for CatererDetail */}
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<div style={{padding: '2rem', textAlign: 'center'}}><h2>Contact Page Coming Soon</h2></div>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;


