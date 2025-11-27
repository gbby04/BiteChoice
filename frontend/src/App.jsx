import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Welcome from './Welcome.jsx';
import Home from './Home.jsx'; // This is your Food App code

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* The Landing Page */}
        <Route path="/" element={<Welcome />} />
        
        {/* The Main Food App */}
        <Route path="/home" element={<Home />} />
        
        {/* Placeholders for later */}
        <Route path="/login" element={<div className="p-10">Login Page Coming Soon</div>} />
        <Route path="/signup" element={<div className="p-10">Signup Page Coming Soon</div>} />
      </Routes>
    </BrowserRouter>
  );
}