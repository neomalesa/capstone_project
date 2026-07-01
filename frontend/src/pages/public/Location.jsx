import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useCurrency } from '../../context/CurrencyContext';

const Location = () => {
  const [searchParams] = useSearchParams();
  const urlLocation = searchParams.get('location');
  
  const { currencySymbol } = useCurrency();
  const [locations, setLocations] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    if (urlLocation && urlLocation !== 'all') {
      setFilter(urlLocation);
    } else {
      setFilter('');
    }
  }, [urlLocation]);

  useEffect(() => {
    const fetchAccommodations = async () => {
      try {
        const response = await axios.get('/api/accommodations');
        setLocations(response.data);
      } catch (error) {
        console.error('Error fetching accommodations', error);
      }
    };
    fetchAccommodations();
  }, []);

  const filteredLocations = filter
    ? locations.filter(loc => 
        loc.location.toLowerCase().includes(filter.toLowerCase()) || 
        loc.title.toLowerCase().includes(filter.toLowerCase())
      )
    : locations;
  return (
    <>
      <Navbar />
      <div className="page-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1>Over {filteredLocations.length} stays</h1>
          <input 
            type="text" 
            placeholder="Filter by location..." 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ padding: '10px 15px', borderRadius: '30px', border: '1px solid var(--border-color)', width: '300px' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {filteredLocations.map(loc => (
            <Link to={`/location/${loc._id}`} key={loc._id} style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
              <div style={{ display: 'flex', border: '1px solid #DDDDDD', borderRadius: '12px', padding: '20px', transition: 'box-shadow 0.2s', cursor: 'pointer', backgroundColor: '#fff', gap: '24px' }}>
                <img 
                  src={loc.images && loc.images.length > 0 ? loc.images[0] : '/images/placeholder_main.png'} 
                  alt={loc.title} 
                  style={{ width: '300px', height: '200px', objectFit: 'cover', borderRadius: '12px', flexShrink: 0 }} 
                />
                
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1, padding: '4px 0' }}>
                  <div>
                    <div style={{ color: '#717171', fontSize: '14px', marginBottom: '4px' }}>{loc.type || 'Private room'}</div>
                    <div style={{ fontSize: '22px', fontWeight: '600', color: '#222222' }}>{loc.title || loc.location}</div>
                    
                    <div style={{ width: '32px', height: '1px', backgroundColor: '#DDDDDD', margin: '12px 0' }}></div>
                    
                    <div style={{ color: '#717171', fontSize: '14px', marginBottom: '4px' }}>
                      {loc.guests || 1} guests · {loc.type || 'Private room'} · {loc.bedrooms || 1} bedrooms · {loc.bathrooms || 1} bathrooms
                    </div>
                    <div style={{ color: '#717171', fontSize: '14px' }}>
                      {loc.amenities && loc.amenities.length > 0 ? loc.amenities.slice(0, 4).join(' · ') : 'Wifi · Kitchen · Free parking'}
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div style={{ display: 'flex', alignItems: 'center', fontSize: '14px', fontWeight: '500', color: '#222222' }}>
                      <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false" style={{ display: 'block', height: '14px', width: '14px', fill: 'currentcolor', marginRight: '4px' }}><path d="M15.094 1.579l-4.124 8.885-9.86 1.27a1 1 0 0 0-.542 1.736l7.293 6.565-1.965 9.852a1 1 0 0 0 1.483 1.061L16 25.951l8.625 4.997a1 1 0 0 0 1.482-1.06l-1.965-9.853 7.293-6.565a1 1 0 0 0-.541-1.735l-9.86-1.271-4.127-8.885a1 1 0 0 0-1.814 0z" fillRule="evenodd"></path></svg>
                      {loc.rating || '4.5'} <span style={{ color: '#717171', fontWeight: 'normal', marginLeft: '4px' }}>({loc.reviews || 0} reviews)</span>
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: '600', color: '#222222' }}>
                      {currencySymbol}{loc.price} <span style={{ fontSize: '14px', fontWeight: 'normal' }}>/ night</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Location;
