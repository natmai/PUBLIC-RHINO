import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported
import './components/SearchBarComponent.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavbarComponent from './components/NavbarComponent';
import HomePage from './pages/HomePage';
import LocationPage from './pages/LocationPage';
import AboutPage from './pages/AboutPage';
import ManageRoutingPage from './pages/ManageRoutingPage';
import ManageListingsPage from './pages/ManageListingsPage';
import ManageAboutPage from './pages/ManageAboutPage';
import EditListingPage from './pages/EditListingPage';
import FirebaseSecurityPage from './security/FirebaseSecurityPage'; // Ensure correct path
import { auth } from './firebase'; // Firebase auth import
import { onAuthStateChanged } from "firebase/auth";

const App = () => {

  return (
    <Router>
      <NavbarComponent />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/locations/:id" element={<LocationPage />} />
        <Route path="/about" element={<AboutPage />} />

      </Routes>
    </Router>
  );
};

export default App;
