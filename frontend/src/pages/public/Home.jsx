import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const navigate = useNavigate();
  const [locations, setLocations] = useState([]);
  const [searchLocation, setSearchLocation] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [activeTab, setActiveTab] = useState('Popular');

  useEffect(() => {
    // Just fetch to wake up backend if needed, or we can just skip it here
    // since the navbar now handles location fetching
  }, []);
  return (
    <>
      <Navbar />
      <div className="page-content" style={{ padding: '0 80px' }}>
        {/* Hero Banner */}
        <div className="hero-banner" style={{
          backgroundColor: '#000',
          color: 'white',
          borderRadius: 'var(--radius-lg)',
          padding: '80px 40px',
          textAlign: 'center',
          marginTop: '20px',
          backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7)), url("https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '400px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>Not sure where to go? Perfect.</h1>
          <Link to="/location" className="btn btn-primary" style={{ backgroundColor: 'white', color: 'var(--primary-color)', fontSize: '18px', padding: '14px 32px', borderRadius: '30px', textDecoration: 'none', fontWeight: 'bold' }}>
            I'm flexible
          </Link>
        </div>

        {/* Inspiration Section */}
        <div style={{ padding: '60px 0' }}>
          <h2 style={{ fontSize: '32px', marginBottom: '30px' }}>Inspiration for your next trip</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
            {[
              { title: 'Sandton City', distance: '53 km away', color: '#cc2d4a', img: 'https://images.unsplash.com/photo-1575917649705-5b59aaa12e6b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
              { title: 'Cape Town', distance: '1,400 km away', color: '#bc1a6e', img: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
              { title: 'Paris, France', distance: '8,700 km away', color: '#de3151', img: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
              { title: 'Tokyo, Japan', distance: '13,500 km away', color: '#d93b30', img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' }
            ].map((dest, i) => (
              <div key={i} style={{
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                backgroundColor: dest.color,
                color: 'white',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}>
                <img src={dest.img} alt={dest.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                <div style={{ padding: '20px', minHeight: '120px' }}>
                  <h3 style={{ fontSize: '24px', marginBottom: '8px' }}>{dest.title}</h3>
                  <p style={{ fontSize: '14px' }}>{dest.distance}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Discover Airbnb Experiences */}
        <div style={{ padding: '40px 0' }}>
          <h2 style={{ fontSize: '32px', marginBottom: '30px' }}>Discover Airbnb Experiences</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
            <div style={{
              borderRadius: 'var(--radius-lg)',
              padding: '40px',
              color: 'white',
              height: '400px',
              backgroundImage: 'url("https://images.unsplash.com/photo-1544465544-1b71aee9dfa3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80")',
              backgroundSize: 'cover'
            }}>
              <h3 style={{ fontSize: '36px', marginBottom: '20px', maxWidth: '300px' }}>Things to do on your trip</h3>
              <button className="btn btn-white">Experiences</button>
            </div>
            <div style={{
              borderRadius: 'var(--radius-lg)',
              padding: '40px',
              color: 'white',
              height: '400px',
              backgroundImage: 'url("https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80")',
              backgroundSize: 'cover'
            }}>
              <h3 style={{ fontSize: '36px', marginBottom: '20px', maxWidth: '300px' }}>Things to do from home</h3>
              <button className="btn btn-white">Online Experiences</button>
            </div>
          </div>
        </div>

        {/* Shop Airbnb Section */}
        <div style={{ padding: '60px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ maxWidth: '400px' }}>
            <h2 style={{ fontSize: '40px', marginBottom: '20px', lineHeight: '1.1' }}>Shop Airbnb<br/>gift cards</h2>
            <button className="btn btn-dark" style={{ padding: '14px 24px', borderRadius: '8px', fontSize: '16px', marginTop: '10px' }}>Learn more</button>
          </div>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <img 
              src="/giftcards.png" 
              alt="Gift Cards" 
              loading="lazy" 
              decoding="async" 
              style={{ width: '100%', maxWidth: '500px', aspectRatio: '1004 / 386', objectFit: 'contain', background: 'transparent' }} 
            />
          </div>
        </div>

        {/* Questions about hosting banner */}
        <div style={{ padding: '60px 0' }}>
          <div style={{
            borderRadius: 'var(--radius-lg)',
            padding: '80px 40px',
            color: 'white',
            backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0.2)), url("https://images.unsplash.com/photo-1556912173-3bb406ef7e77?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            height: '350px'
          }}>
            <h2 style={{ fontSize: '48px', marginBottom: '20px', maxWidth: '400px' }}>Questions about hosting?</h2>
            <button className="btn btn-white" style={{ padding: '14px 24px', fontSize: '16px', borderRadius: '8px' }}>Ask a Superhost</button>
          </div>
        </div>

        {/* Inspiration for future getaways tabs */}
        <div style={{ padding: '40px 0 80px 0' }}>
          <h2 style={{ fontSize: '32px', marginBottom: '30px' }}>Inspiration for future getaways</h2>
          <div style={{ display: 'flex', gap: '24px', borderBottom: '1px solid #DDDDDD', marginBottom: '32px', overflowX: 'auto' }}>
            {['Popular', 'Arts & culture', 'Beach', 'Mountains', 'Outdoors', 'Things to do', 'Airbnb-friendly apartments'].map((tab, i) => (
              <div key={i} 
                onClick={() => setActiveTab(tab)}
                style={{ 
                cursor: 'pointer', 
                fontSize: '14px', 
                fontWeight: activeTab === tab ? '600' : '400',
                color: activeTab === tab ? '#222222' : '#717171',
                borderBottom: activeTab === tab ? '2px solid #222222' : '2px solid transparent',
                paddingBottom: '12px',
                marginBottom: '-1px',
                whiteSpace: 'nowrap',
                transition: 'color 0.2s'
              }}>
                {tab}
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', color: 'var(--text-light)', fontSize: '14px' }}>
            <div>
              <p style={{ fontWeight: '600', color: 'var(--text-color)', margin: '0 0 4px 0' }}>Phoenix</p>
              <p style={{ margin: 0 }}>Arizona</p>
            </div>
            <div>
              <p style={{ fontWeight: '600', color: 'var(--text-color)', margin: '0 0 4px 0' }}>Hot Springs</p>
              <p style={{ margin: 0 }}>Arkansas</p>
            </div>
            <div>
              <p style={{ fontWeight: '600', color: 'var(--text-color)', margin: '0 0 4px 0' }}>Los Angeles</p>
              <p style={{ margin: 0 }}>California</p>
            </div>
            <div>
              <p style={{ fontWeight: '600', color: 'var(--text-color)', margin: '0 0 4px 0' }}>San Diego</p>
              <p style={{ margin: 0 }}>California</p>
            </div>
            <div>
              <p style={{ fontWeight: '600', color: 'var(--text-color)', margin: '0 0 4px 0' }}>San Francisco</p>
              <p style={{ margin: 0 }}>California</p>
            </div>
            <div>
              <p style={{ fontWeight: '600', color: 'var(--text-color)', margin: '0 0 4px 0' }}>Barcelona</p>
              <p style={{ margin: 0 }}>Catalonia</p>
            </div>
            <div>
              <p style={{ fontWeight: '600', color: 'var(--text-color)', margin: '0 0 4px 0' }}>Prague</p>
              <p style={{ margin: 0 }}>Czechia</p>
            </div>
            <div>
              <p style={{ fontWeight: '600', color: 'var(--text-color)', margin: '0 0 4px 0' }}>Washington</p>
              <p style={{ margin: 0 }}>District of Columbia</p>
            </div>
          </div>
        </div>

      </div>
      <Footer />
    </>
  );
};

export default Home;
