import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import DashboardListings from './DashboardListings';
import CreateListingForm from './CreateListingForm';
import ReservationsList from './ReservationsList';
import { useAuth } from '../../context/AuthContext';

const HostDashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('listings');

  // Allow routing to specific tabs via state
  useEffect(() => {
    if (location.state && location.state.tab) {
      setActiveTab(location.state.tab);
      // Clear state so refresh doesn't force tab
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  return (
    <>
      <Navbar />
      <div className="page-content" style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '32px', color: '#222222' }}>Host Dashboard</h1>
        
        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid #ebebeb', paddingBottom: '16px', marginBottom: '32px' }}>
          <button 
            onClick={() => setActiveTab('listings')}
            style={{
              padding: '10px 20px',
              border: 'none',
              backgroundColor: activeTab === 'listings' ? '#f7f7f7' : 'transparent',
              color: '#222',
              borderRadius: '24px',
              cursor: 'pointer',
              fontWeight: activeTab === 'listings' ? '600' : '500',
              fontSize: '15px'
            }}
          >
            My Listings
          </button>
          <button 
            onClick={() => setActiveTab('create')}
            style={{
              padding: '10px 20px',
              border: 'none',
              backgroundColor: activeTab === 'create' ? '#f7f7f7' : 'transparent',
              color: '#222',
              borderRadius: '24px',
              cursor: 'pointer',
              fontWeight: activeTab === 'create' ? '600' : '500',
              fontSize: '15px'
            }}
          >
            Create Listing
          </button>
          <button 
            onClick={() => setActiveTab('reservations')}
            style={{
              padding: '10px 20px',
              border: 'none',
              backgroundColor: activeTab === 'reservations' ? '#f7f7f7' : 'transparent',
              color: '#222',
              borderRadius: '24px',
              cursor: 'pointer',
              fontWeight: activeTab === 'reservations' ? '600' : '500',
              fontSize: '15px'
            }}
          >
            Reservations
          </button>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'listings' && <DashboardListings setActiveTab={setActiveTab} />}
          {activeTab === 'create' && <CreateListingForm setActiveTab={setActiveTab} />}
          {activeTab === 'reservations' && <ReservationsList />}
        </div>
      </div>
    </>
  );
};

export default HostDashboard;
