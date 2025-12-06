import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// === 1. ENTRY & AUTH PAGES ===
import Welcome from './pages/Welcome.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';

// === 2. MAIN TAB PAGES (With Navbar) ===
import Home from './pages/Home.jsx';
import FavouritePage from './pages/FavouritePage.jsx';
import HistoryPage from './pages/HistoryPage.jsx';
import ReviewPage from './pages/ReviewPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';

// === 3. FEATURE PAGES (No Bottom Navbar usually) ===
import MapPage from './pages/MapPage.jsx';
import WriteReviewPage from './pages/WriteReviewPage.jsx';
import PremiumPlanPage from './pages/PremiumPlanPage.jsx';
import EditProfilePage from './pages/EditProfilePage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* --- ENTRY POINT --- */}
        <Route path="/" element={<Welcome />} />
        
        {/* --- AUTHENTICATION --- */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        
        {/* --- MAIN APP TABS --- */}
        <Route path="/home" element={<Home />} />
        <Route path="/favourites" element={<FavouritePage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/review" element={<ReviewPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        
        {/* --- FEATURE & SUB-PAGES --- */}
        <Route path="/map" element={<MapPage />} />
        <Route path="/writereview" element={<WriteReviewPage />} />
        <Route path="/premium" element={<PremiumPlanPage />} />
        <Route path="/edit-profile" element={<EditProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />

      </Routes>
    </BrowserRouter>
  );
}
