import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const MyReservations = () => {
  const { user } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReservations();
  }, [user]);

  const fetchReservations = async () => {
    try {
      const res = await axios.get('/api/reservations/user');
      setReservations(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching reservations:', err);
      setError('Failed to load reservations.');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to cancel this reservation?')) {
      try {
        await axios.delete(`/api/reservations/${id}`);
        fetchReservations();
      } catch (err) {
        console.error('Error deleting reservation', err);
        alert('Failed to cancel reservation.');
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="page-content" style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        <h1 style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold', marginBottom: '40px', color: '#222222' }}>My Reservations</h1>

        {error && <div style={{ color: '#dc2626', marginBottom: '20px', textAlign: 'center' }}>{error}</div>}

        {loading ? (
          <div style={{ textAlign: 'center' }}>Loading reservations...</div>
        ) : reservations.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#f7f7f7', borderRadius: '8px' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '8px', color: '#222222' }}>No reservations found</h3>
            <p style={{ color: '#717171' }}>You do not have any upcoming trips.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto', border: '1px solid #ebebeb', borderRadius: '4px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f7f7f7', borderBottom: '1px solid #ebebeb' }}>
                  <th style={{ padding: '16px', fontWeight: 'bold', color: '#222222' }}>Booked by</th>
                  <th style={{ padding: '16px', fontWeight: 'bold', color: '#222222' }}>Property name</th>
                  <th style={{ padding: '16px', fontWeight: 'bold', color: '#222222' }}>Check-in Date</th>
                  <th style={{ padding: '16px', fontWeight: 'bold', color: '#222222' }}>Check-out Date</th>
                  <th style={{ padding: '16px', fontWeight: 'bold', color: '#222222' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((res, index) => {
                  const checkIn = new Date(res.startDate);
                  const checkOut = new Date(res.endDate);
                  
                  const formatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
                  const checkInStr = checkIn.toLocaleDateString('en-GB', formatOptions);
                  const checkOutStr = checkOut.toLocaleDateString('en-GB', formatOptions);
                  
                  return (
                    <tr key={res._id} style={{ borderBottom: index === reservations.length - 1 ? 'none' : '1px solid #ebebeb', backgroundColor: 'white' }}>
                      <td style={{ padding: '16px', color: '#222222' }}>
                        {res.userId?.username || user?.username || 'User'}
                      </td>
                      <td style={{ padding: '16px', color: '#222222' }}>
                        {res.accommodationId ? res.accommodationId.title : 'Accommodation Deleted'}
                      </td>
                      <td style={{ padding: '16px', color: '#222222' }}>{checkInStr}</td>
                      <td style={{ padding: '16px', color: '#222222' }}>{checkOutStr}</td>
                      <td style={{ padding: '16px' }}>
                        <button 
                          onClick={() => handleDelete(res._id)} 
                          style={{ 
                            backgroundColor: '#e31c5f', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '4px', 
                            padding: '10px 32px', 
                            fontSize: '14px', 
                            fontWeight: '500', 
                            cursor: 'pointer',
                            transition: 'background-color 0.2s'
                          }}
                          onMouseOver={(e) => e.target.style.backgroundColor = '#d70466'} 
                          onMouseOut={(e) => e.target.style.backgroundColor = '#e31c5f'}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default MyReservations;
