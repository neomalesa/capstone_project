import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/public/Home';
import Location from './pages/public/Location';
import LocationDetails from './pages/public/LocationDetails';
import Login from './pages/admin/Login';
import HostDashboard from './pages/admin/HostDashboard';
import UpdateListing from './pages/admin/UpdateListing';
import MyReservations from './pages/public/MyReservations';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CurrencyProvider } from './context/CurrencyContext';
import './index.css';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/" replace />;
  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <CurrencyProvider>
        <Router>
          <div className="app-container">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/location" element={<Location />} />
              <Route path="/location/:id" element={<LocationDetails />} />
              
              <Route path="/view-reservations" element={
                <ProtectedRoute>
                  <MyReservations />
                </ProtectedRoute>
              } />
              
              {/* Admin Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/host/dashboard" element={
                <ProtectedRoute>
                  <HostDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/update/:id" element={
                <ProtectedRoute>
                  <UpdateListing />
                </ProtectedRoute>
              } />
            </Routes>
          </div>
        </Router>
      </CurrencyProvider>
    </AuthProvider>
  );
};

export default App;
