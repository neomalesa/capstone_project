import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useCurrency } from '../../context/CurrencyContext';

const DashboardListings = ({ setActiveTab }) => {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currencySymbol } = useCurrency();

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const response = await axios.get('/api/accommodations');
      if (user && user.role !== 'admin') {
        setListings(response.data.filter(listing => listing.host === user.id || listing.host === user._id));
      } else {
        setListings(response.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching listings', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      try {
        await axios.delete(`/api/accommodations/${id}`);
        fetchListings();
      } catch (error) {
        console.error('Error deleting listing', error);
        alert('Failed to delete listing. You might not have permission.');
      }
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '40px' }}>Loading your listings...</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {listings.map(listing => (
          <div key={listing._id} style={{ display: 'flex', alignItems: 'center', border: '1px solid #ebebeb', borderRadius: '12px', padding: '16px', backgroundColor: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <img 
              src={listing.images && listing.images.length > 0 ? listing.images[0] : '/images/placeholder_main.png'} 
              alt={listing.title} 
              onError={(e) => { e.target.onerror = null; e.target.src = '/images/placeholder_main.png'; }}
              style={{ width: '160px', height: '120px', objectFit: 'cover', borderRadius: '8px', marginRight: '24px' }} 
            />
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px', color: '#222222' }}>{listing.title}</h3>
              <p style={{ color: '#717171', fontSize: '14px', marginBottom: '4px' }}>Location: {listing.location} · {listing.guests} Guests · {listing.bedrooms} Bedrooms</p>
              <p style={{ fontWeight: '500', color: '#222222', marginTop: '8px' }}>{currencySymbol}{listing.price} / night</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minWidth: '120px' }}>
              <Link 
                to={`/admin/update/${listing._id}`} 
                style={{ backgroundColor: '#0056b3', color: 'white', textAlign: 'center', padding: '10px', borderRadius: '6px', textDecoration: 'none', fontWeight: '500', fontSize: '14px', transition: 'background-color 0.2s' }}
                onMouseOver={e => e.currentTarget.style.backgroundColor = '#004494'}
                onMouseOut={e => e.currentTarget.style.backgroundColor = '#0056b3'}
              >
                Update
              </Link>
              <button 
                onClick={() => handleDelete(listing._id)} 
                style={{ backgroundColor: '#e31c5f', color: 'white', border: 'none', padding: '10px', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', fontSize: '14px', transition: 'background-color 0.2s' }}
                onMouseOver={e => e.currentTarget.style.backgroundColor = '#d70466'}
                onMouseOut={e => e.currentTarget.style.backgroundColor = '#e31c5f'}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {listings.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#f7f7f7', borderRadius: '12px' }}>
            <h3 style={{ fontSize: '20px', marginBottom: '12px', color: '#222222' }}>No listings found</h3>
            <p style={{ color: '#717171', marginBottom: '24px' }}>Create your first property listing to get started.</p>
            <button 
              onClick={() => setActiveTab('create')} 
              style={{ backgroundColor: '#e31c5f', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Create Listing
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardListings;
