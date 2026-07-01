import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import SearchCalendar from './SearchCalendar';

const Navbar = () => {
  const { user, logout, setShowLoginModal, setIsSignupMode } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isHostPage = location.pathname.startsWith('/host') || location.pathname.startsWith('/admin') || location.pathname === '/login';

  const [locations, setLocations] = useState([]);
  const [searchLocation, setSearchLocation] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const calendarRef = useRef(null);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setCalendarOpen(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    // Fetch all unique locations
    const fetchLocations = async () => {
      try {
        const response = await axios.get('/api/accommodations');
        const uniqueLocations = [...new Set(response.data.map(item => item.location))];
        setLocations(uniqueLocations);
      } catch (err) {
        console.error('Error fetching locations:', err);
      }
    };
    fetchLocations();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchLocation && searchLocation !== 'all') params.append('location', searchLocation);
    if (checkIn) params.append('checkIn', checkIn);
    if (checkOut) params.append('checkOut', checkOut);
    if (guests) params.append('guests', guests);
    navigate(`/location?${params.toString()}`);
  };

  const handleLocationSelect = (e) => {
    const val = e.target.value;
    setSearchLocation(val);
    
    const params = new URLSearchParams();
    if (val && val !== 'all') params.append('location', val);
    if (checkIn) params.append('checkIn', checkIn);
    if (checkOut) params.append('checkOut', checkOut);
    if (guests) params.append('guests', guests);
    navigate(`/location?${params.toString()}`);
  };

  return (
    <header className="header">
      <Link to="/" className="logo-container" style={{ display: 'flex', alignItems: 'center' }}>
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg" 
          alt="Airbnb logo" 
          style={{ height: '32px' }} 
        />
      </Link>

      {/* Dynamic Filter Search Bar */}
      {!isHostPage && (
      <form onSubmit={handleSearch} style={{
        display: 'flex',
        backgroundColor: 'white',
        borderRadius: '40px',
        border: '1px solid var(--border-color)',
        padding: '6px 6px 6px 20px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.05)',
        alignItems: 'center',
        margin: '0 20px'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', minWidth: '120px' }}>
          <label style={{ fontSize: '10px', fontWeight: 'bold' }}>Location</label>
          <select 
            value={searchLocation} 
            onChange={handleLocationSelect}
            style={{ border: 'none', outline: 'none', fontSize: '13px', background: 'transparent', padding: '0', cursor: 'pointer', appearance: 'none' }}
          >
            <option value="" disabled>Select a Location</option>
            <option value="all">All Locations</option>
            {locations.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>
        
        <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--border-color)', margin: '0 12px' }}></div>
        
        <div style={{ position: 'relative' }} ref={calendarRef}>
          <div 
            style={{ display: 'flex', cursor: 'pointer', alignItems: 'center' }}
            onClick={() => setCalendarOpen(!calendarOpen)}
          >
            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', width: '100px' }}>
              <label style={{ fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' }}>Check in</label>
              <div style={{ fontSize: '13px', color: checkIn ? '#222' : '#717171' }}>{checkIn ? new Date(checkIn).toLocaleDateString() : 'Add dates'}</div>
            </div>

            <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--border-color)', margin: '0 12px' }}></div>

            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', width: '100px' }}>
              <label style={{ fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' }}>Check out</label>
              <div style={{ fontSize: '13px', color: checkOut ? '#222' : '#717171' }}>{checkOut ? new Date(checkOut).toLocaleDateString() : 'Add dates'}</div>
            </div>
          </div>

          <SearchCalendar 
            isOpen={calendarOpen} 
            onClose={() => setCalendarOpen(false)} 
            onSelectDates={(start, end) => {
              if (start) setCheckIn(start.toISOString());
              if (end) {
                setCheckOut(end.toISOString());
                setCalendarOpen(false);
              }
            }} 
          />
        </div>

        <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--border-color)', margin: '0 12px' }}></div>

        <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', width: '60px' }}>
          <label style={{ fontSize: '10px', fontWeight: 'bold' }}>Guests</label>
          <input type="number" min="1" value={guests} onChange={e => setGuests(e.target.value)} style={{ border: 'none', outline: 'none', fontSize: '13px', background: 'transparent', width: '100%', padding: 0 }} />
        </div>

        <button type="submit" style={{ 
          backgroundColor: 'var(--primary-color)', 
          color: 'white', 
          border: 'none', 
          borderRadius: '50%', 
          width: '32px', 
          height: '32px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          marginLeft: '12px',
          cursor: 'pointer'
        }}>
          <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false" style={{ display: 'block', fill: 'none', height: '12px', width: '12px', stroke: 'currentColor', strokeWidth: '5.33333', overflow: 'visible' }}><g fill="none"><path d="m13 24c6.0751322 0 11-4.9248678 11-11 0-6.07513225-4.9248678-11-11-11-6.07513225 0-11 4.92486775-11 11 0 6.0751322 4.92486775 11 11 11zm8-3 9 9"></path></g></svg>
        </button>
      </form>
      )}
      
      <div className="nav-links">
        {isHostPage ? (
          user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontSize: '14px', fontWeight: '500', color: '#222222' }}>Welcome, {user.username}</span>
              <button onClick={handleLogout} style={{ fontSize: '14px', fontWeight: '600', padding: '8px 16px', borderRadius: '24px', border: '1px solid #dddddd', backgroundColor: 'white', cursor: 'pointer', transition: 'box-shadow 0.2s' }} onMouseOver={e => e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)'} onMouseOut={e => e.target.style.boxShadow = 'none'}>Logout</button>
            </div>
          ) : null
        ) : (
          <>
            {user ? (
              <span style={{ fontSize: '14px', fontWeight: '500', color: '#222222' }}>Welcome, {user.username}</span>
            ) : (
              <Link to="/login" style={{ fontSize: '14px', fontWeight: '500', color: '#222222', textDecoration: 'none', marginRight: '16px', display: 'flex', alignItems: 'center' }}>Become a host</Link>
            )}
            
            <div 
              className="profile-menu"
              ref={dropdownRef}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px', 
                padding: '5px 5px 5px 12px', 
                border: '1px solid #dddddd', 
                borderRadius: '24px', 
                cursor: 'pointer',
                position: 'relative',
                backgroundColor: 'white',
                transition: 'box-shadow 0.2s ease',
                marginLeft: '16px'
              }}
              onMouseOver={e => e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.18)'}
              onMouseOut={e => e.currentTarget.style.boxShadow = 'none'}
            >
              <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false" style={{ display: 'block', fill: 'none', height: '16px', width: '16px', stroke: '#222222', strokeWidth: 3, overflow: 'visible' }}>
                <g fill="none" fillRule="nonzero"><path d="m2 16h28"></path><path d="m2 24h28"></path><path d="m2 8h28"></path></g>
              </svg>
              <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false" style={{ display: 'block', height: '32px', width: '32px', fill: '#717171' }}>
                <path d="m16 .7c-8.437 0-15.3 6.863-15.3 15.3s6.863 15.3 15.3 15.3 15.3-6.863 15.3-15.3-6.863-15.3-15.3-15.3zm0 28c-4.021 0-7.605-1.884-9.933-4.81a12.425 12.425 0 0 1 6.451-4.4 6.507 6.507 0 0 1 -3.018-5.49c0-3.584 2.916-6.5 6.5-6.5s6.5 2.916 6.5 6.5a6.513 6.513 0 0 1 -3.019 5.491 12.42 12.42 0 0 1 6.452 4.4c-2.328 2.925-5.912 4.809-9.933 4.809z"></path>
              </svg>
              
              <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, background: 'white', padding: '8px 0', boxShadow: '0 2px 16px rgba(0,0,0,0.12)', borderRadius: '12px', minWidth: '240px', display: isDropdownOpen ? 'block' : 'none', zIndex: 1000 }} className="dropdown-content">
                {user ? (
                  <>
                    <Link to="/view-reservations" className="dropdown-item" style={{ display: 'block', padding: '12px 16px', textDecoration: 'none', color: '#222', fontSize: '14px', fontWeight: '500' }}>My Reservations</Link>
                    
                    {user.role === 'admin' && (
                      <>
                        <hr style={{ border: 'none', borderTop: '1px solid #dddddd', margin: '8px 0' }} />
                        <Link to="/host/dashboard" state={{ tab: 'listings' }} className="dropdown-item" style={{ display: 'block', padding: '12px 16px', textDecoration: 'none', color: '#222', fontSize: '14px', fontWeight: '500' }}>Host Dashboard</Link>
                        <Link to="/host/dashboard" state={{ tab: 'reservations' }} className="dropdown-item" style={{ display: 'block', padding: '12px 16px', textDecoration: 'none', color: '#222', fontSize: '14px' }}>Host Reservations</Link>
                      </>
                    )}

                    <hr style={{ border: 'none', borderTop: '1px solid #dddddd', margin: '8px 0' }} />
                    <button onClick={handleLogout} className="dropdown-item" style={{ display: 'block', width: '100%', textAlign: 'left', padding: '12px 16px', background: 'none', border: 'none', cursor: 'pointer', color: '#222', fontSize: '14px' }}>Logout</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => { setShowLoginModal && setShowLoginModal(true); setIsSignupMode && setIsSignupMode(false); }} className="dropdown-item" style={{ display: 'block', width: '100%', textAlign: 'left', padding: '12px 16px', background: 'none', border: 'none', cursor: 'pointer', color: '#222', fontSize: '14px', fontWeight: '600' }}>Log in</button>
                    <button onClick={() => { setShowLoginModal && setShowLoginModal(true); setIsSignupMode && setIsSignupMode(true); }} className="dropdown-item" style={{ display: 'block', width: '100%', textAlign: 'left', padding: '12px 16px', background: 'none', border: 'none', cursor: 'pointer', color: '#222', fontSize: '14px' }}>Sign up</button>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>
      <style>{`
        .dropdown-item:hover {
          background-color: #f7f7f7;
        }
      `}</style>
    </header>
  );
};

export default Navbar;
