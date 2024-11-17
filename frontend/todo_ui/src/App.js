// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Reminders from './pages/Reminders';
import Profile from './pages/Profile'
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <div className="h-full bg-gray-100">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/reminders" element={
          <ProtectedRoute>
            <Reminders />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  );
}

export default App;
