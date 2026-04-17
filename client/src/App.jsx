import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; // 🟢 1. Import Toaster
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';

export default function App() {
  return (
    <Router>
      {/* 🟢 2. Add Toaster here (Global configuration) */}
      <Toaster 
          position="top-center" 
          reverseOrder={false} 
          toastOptions={{
            // 🟢 Custom styling to make toasts bigger and more "vibrant"
            style: {
              minWidth: '350px',      // Makes the toast wider
              padding: '20px 28px',    // Increases internal spacing
              borderRadius: '24px',   // Matches your rounded UI theme
              background: '#ffffff',
              color: '#1e293b',
              border: '2px solid #e2e8f0', // Thicker border for better visibility
              fontWeight: '800',       // Bold text
              fontSize: '16px',        // Larger font size
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              fontFamily: 'Sora, sans-serif', // Using a premium font feel
            },
            success: {
              style: {
                border: '2px solid #22c55e', // Green border for success
              },
              iconTheme: {
                primary: '#22c55e',
                secondary: '#fff',
              },
            },
            error: {
              style: {
                border: '2px solid #ef4444', // Red border for errors
              },
            },
          }}
        />

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}