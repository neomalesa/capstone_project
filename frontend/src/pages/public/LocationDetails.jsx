import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useCurrency } from '../../context/CurrencyContext';
import AmenityIcon from '../../components/AmenityIcon';

const LocationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, setShowLoginModal } = useAuth();
  const { currencySymbol } = useCurrency();
  
  const [accommodation, setAccommodation] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [nights, setNights] = useState(0);
  const [guests, setGuests] = useState(1);
  const [loading, setLoading] = useState(true);
  const [reserveError, setReserveError] = useState('');
  const [reserveSuccess, setReserveSuccess] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        // Find accommodation by ID from the backend
        const response = await axios.get('/api/accommodations');
        const acc = response.data.find(a => a._id === id);
        setAccommodation(acc);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching accommodation details', error);
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setNights(diffDays > 0 ? diffDays : 0);
    } else {
      setNights(0);
    }
  }, [startDate, endDate]);

  const handleReserve = async () => {
    setReserveError('');
    setReserveSuccess('');
    
    if (!user) {
      window.alert("Please log in or sign up first to make a reservation.");
      setShowLoginModal(true);
      return;
    }

    if (!startDate || !endDate || nights === 0) {
      setReserveError('Please select valid check-in and check-out dates.');
      return;
    }

    try {
      const payload = {
        accommodationId: accommodation._id,
        startDate,
        endDate,
        guests,
        totalPrice: total
      };
      
      await axios.post('/api/reservations', payload);
      setReserveSuccess(''); // clear any old text message
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error creating reservation:', error);
      setReserveError(error.response?.data?.message || 'Failed to create reservation.');
    }
  };

  if (loading) return <div style={{ padding: '80px', textAlign: 'center' }}>Loading...</div>;
  if (!accommodation) return <div style={{ padding: '80px', textAlign: 'center' }}>Accommodation not found.</div>;

  const defaultImages = [
    '/images/placeholder_main.png',
    '/images/placeholder_kitchen.png',
    '/images/placeholder_bathroom.png',
    '/images/placeholder_bedroom.png',
    '/images/placeholder_exterior.png'
  ];

  const images = accommodation.images && accommodation.images.length > 0 
    ? [...accommodation.images] 
    : [];

  while (images.length < 5) {
    images.push(defaultImages[images.length]);
  }

  const basePrice = accommodation.price || 1000;
  const totalNightsCost = basePrice * nights;
  const cleaningFee = accommodation.cleaningFee || 50;
  const serviceFee = accommodation.serviceFee || 25;
  const occupancyTaxes = accommodation.occupancyTaxes || 15;
  const weeklyDiscount = nights >= 7 ? accommodation.weeklyDiscount || 0 : 0;
  const total = totalNightsCost + cleaningFee + serviceFee + occupancyTaxes - weeklyDiscount;

  const renderCalendarMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const monthName = date.toLocaleString('default', { month: 'long' });

    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    const handleDateClick = (clickedDate) => {
      const today = new Date();
      today.setHours(0,0,0,0);
      if (clickedDate < today) return; // Cannot select past dates

      const clickedDateStr = `${clickedDate.getFullYear()}-${String(clickedDate.getMonth() + 1).padStart(2, '0')}-${String(clickedDate.getDate()).padStart(2, '0')}`;

      if (!startDate || (startDate && endDate)) {
        // Start a new selection
        setStartDate(clickedDateStr);
        setEndDate('');
      } else if (startDate && !endDate) {
        // We have a start date, check if clicked date is after
        const currentStart = new Date(startDate.split('-')[0], startDate.split('-')[1] - 1, startDate.split('-')[2]);
        if (clickedDate > currentStart) {
          setEndDate(clickedDateStr);
        } else {
          // If they click a date before the start date, make that the new start date
          setStartDate(clickedDateStr);
        }
      }
    };

    return (
      <div style={{ flex: 1 }}>
        <h4 style={{ textAlign: 'center', marginBottom: '16px', fontSize: '16px', fontWeight: '600' }}>{monthName} {year}</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', textAlign: 'center', marginBottom: '8px' }}>
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => <div key={d} style={{ fontSize: '12px', color: '#717171', fontWeight: '600' }}>{d}</div>)}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', textAlign: 'center' }}>
          {days.map((day, index) => {
            if (!day) return <div key={`empty-${index}`}></div>;
            
            // To prevent time zone offset bugs, we construct dates locally at midnight
            const currentDayDate = new Date(year, month, day);
            
            // Note: input type="date" values are in 'YYYY-MM-DD' UTC.
            const startStr = startDate ? startDate.split('-') : null;
            const endStr = endDate ? endDate.split('-') : null;
            
            const start = startStr ? new Date(startStr[0], startStr[1] - 1, startStr[2]) : null;
            const end = endStr ? new Date(endStr[0], endStr[1] - 1, endStr[2]) : null;
            
            let isSelected = false;
            let isBetween = false;
            
            const today = new Date();
            today.setHours(0,0,0,0);
            let isPast = currentDayDate < today;
            
            if (start && start.getTime() === currentDayDate.getTime()) isSelected = true;
            if (end && end.getTime() === currentDayDate.getTime()) isSelected = true;
            
            if (start && end && currentDayDate > start && currentDayDate < end) {
               isBetween = true;
            }

            let bg = 'transparent';
            let color = isPast ? '#dddddd' : '#222222';
            let borderRadius = '0';
            
            if (isSelected) {
              bg = '#222222';
              color = 'white';
              borderRadius = '50%';
            } else if (isBetween) {
              bg = '#f7f7f7';
            }

            return (
              <div 
                key={index} 
                onClick={() => handleDateClick(currentDayDate)}
                style={{ 
                  height: '40px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  backgroundColor: bg,
                  color: color,
                  borderRadius: borderRadius,
                  fontSize: '14px',
                  fontWeight: '500',
                  textDecoration: isPast ? 'line-through' : 'none',
                  cursor: isPast ? 'default' : 'pointer',
                  border: (!isPast && !isSelected && !isBetween) ? '1px solid transparent' : 'none',
                  transition: 'border-color 0.1s, background-color 0.1s'
                }}
                onMouseOver={(e) => {
                  if (!isPast && !isSelected) {
                    e.target.style.border = '1px solid #222222';
                    e.target.style.borderRadius = '50%';
                  }
                }}
                onMouseOut={(e) => {
                  if (!isPast && !isSelected) {
                    e.target.style.border = '1px solid transparent';
                    e.target.style.borderRadius = borderRadius;
                  }
                }}
              >
                {day}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <div className="page-content" style={{ maxWidth: '1120px' }}>
        <h1 style={{ fontSize: '26px', marginBottom: '10px' }}>{accommodation.title}</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', fontSize: '14px', fontWeight: '500' }}>
          <span>⭐ {accommodation.rating || 'New'}</span>
          <span>·</span>
          <span style={{ textDecoration: 'underline' }}>{accommodation.reviews || 0} reviews</span>
          <span>·</span>
          <span style={{ textDecoration: 'underline' }}>{accommodation.location}</span>
        </div>

        {/* Image Gallery */}
        <div style={{ display: 'flex', gap: '8px', height: '400px', marginBottom: '40px', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          <div style={{ flex: 1 }}>
            <img src={images[0]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Main" onError={(e) => { e.target.onerror = null; e.target.src = '/images/placeholder_main.png'; }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: '8px', flex: 1 }}>
            <img src={images[1]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Gallery 1" onError={(e) => { e.target.onerror = null; e.target.src = '/images/placeholder_kitchen.png'; }} />
            <img src={images[2]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Gallery 2" onError={(e) => { e.target.onerror = null; e.target.src = '/images/placeholder_bathroom.png'; }} />
            <img src={images[3]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Gallery 3" onError={(e) => { e.target.onerror = null; e.target.src = '/images/placeholder_bedroom.png'; }} />
            <img src={images[4]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Gallery 4" onError={(e) => { e.target.onerror = null; e.target.src = '/images/placeholder_exterior.png'; }} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '80px' }}>
          {/* Left Column: Details */}
          <div style={{ flex: '2' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: '24px', borderBottom: '1px solid var(--border-color)' }}>
              <div>
                <h2 style={{ fontSize: '22px', marginBottom: '4px', fontWeight: '600' }}>{accommodation.type || 'Entire apartment'} hosted by {accommodation.hostName || 'Host'}</h2>
                <p style={{ color: 'var(--text-light)', margin: 0 }}>{accommodation.guests} guests · {accommodation.type || 'Entire apartment'} · {accommodation.bedrooms} bedrooms · {accommodation.bathrooms} baths</p>
              </div>
              <div style={{ position: 'relative', width: '56px', height: '56px', flexShrink: 0, marginLeft: '16px' }}>
                <img 
                  src={accommodation.hostImage || "/images/placeholder_avatar.png"} 
                  alt="Host" 
                  onError={(e) => { e.target.onerror = null; e.target.src = '/images/placeholder_avatar.png'; }}
                  style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} 
                />
                <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false" style={{ display: 'block', height: '16px', width: '16px', fill: '#ff385c', position: 'absolute', bottom: '0px', right: '-4px', backgroundColor: '#fff', borderRadius: '50%', border: '2px solid #fff' }}><path d="M16 1a15 15 0 1 1 0 30 15 15 0 0 1 0-30zm6.14 8.78L15 16.92l-4.14-4.14-2.12 2.12L15 21.16l9.26-9.26-2.12-2.12z"></path></svg>
              </div>
            </div>
            
            <div style={{ padding: '32px 0', borderBottom: '1px solid var(--border-color)', fontSize: '16px', lineHeight: '24px' }}>
              <p style={{ margin: 0, whiteSpace: 'pre-line' }}>{accommodation.description || 'Experience the heart of the city in this beautiful, sun-drenched space. Steps away from all the major attractions and central parks.'}</p>
            </div>

            <div style={{ padding: '32px 0', borderBottom: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '22px', marginBottom: '24px', fontWeight: '600', color: '#222222' }}>What this place offers</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', paddingBottom: '24px' }}>
                {(accommodation.amenities && accommodation.amenities.length > 0 ? accommodation.amenities : ['Wifi', 'Kitchen', 'Free parking']).map((amenity, i) => {
                  const isCrossedOut = amenity.toLowerCase() === 'carbon monoxide alarm' || amenity.toLowerCase() === 'smoke alarm';
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingBottom: '8px' }}>
                      <div style={{ color: '#222222' }}>
                        <AmenityIcon name={amenity} />
                      </div>
                      <span style={{ fontSize: '16px', color: '#222222', textDecoration: isCrossedOut ? 'line-through' : 'none' }}>{amenity}</span>
                    </div>
                  );
                })}
              </div>
              <button style={{ padding: '13px 23px', fontSize: '16px', fontWeight: '600', backgroundColor: '#f7f7f7', border: '1px solid #222222', borderRadius: '8px', cursor: 'pointer', color: '#222222', transition: 'background-color 0.2s' }} onMouseOver={(e) => e.target.style.backgroundColor = '#e8e8e8'} onMouseOut={(e) => e.target.style.backgroundColor = '#f7f7f7'}>
                Show all {accommodation.amenities?.length || 38} amenities
              </button>
            </div>

            {/* Where you'll sleep */}
            <div style={{ padding: '32px 0', borderBottom: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '22px', marginBottom: '24px', fontWeight: '600' }}>Where you'll sleep</h3>
              <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '8px' }}>
                {[...Array(accommodation.bedrooms || 1)].map((_, i) => (
                  <div key={i} style={{ width: '320px', flexShrink: 0 }}>
                    <img src={images[(i + 1) % images.length]} alt={`Bedroom ${i + 1}`} onError={(e) => { e.target.onerror = null; e.target.src = '/images/placeholder_bedroom.png'; }} style={{ width: '100%', height: '213px', objectFit: 'cover', borderRadius: '12px', marginBottom: '12px' }} />
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '600', color: '#222222' }}>{accommodation.bedrooms > 1 ? `Bedroom ${i + 1}` : 'Bedroom'}</h4>
                    <p style={{ margin: 0, color: '#717171', fontSize: '14px' }}>1 {i === 0 ? 'king' : 'queen'} bed</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Calendar */}
            <div style={{ padding: '32px 0', borderBottom: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '22px', marginBottom: '8px', fontWeight: '600', color: '#222222' }}>
                {nights > 0 ? `${nights} nights in ${accommodation.location}` : `Select check-in date`}
              </h3>
              <p style={{ color: '#717171', marginBottom: '24px', fontSize: '14px' }}>
                {startDate && endDate ? `${new Date(startDate.split('-')[0], startDate.split('-')[1] - 1, startDate.split('-')[2]).toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' })} - ${new Date(endDate.split('-')[0], endDate.split('-')[1] - 1, endDate.split('-')[2]).toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' })}` : 'Add your travel dates for exact pricing'}
              </p>
              <div style={{ display: 'flex', gap: '48px', padding: '0 16px' }}>
                {renderCalendarMonth(new Date())}
                {renderCalendarMonth(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1))}
              </div>
            </div>

            {/* Reviews */}
            <div style={{ padding: '32px 0', borderBottom: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '22px', marginBottom: '24px' }}>⭐ {accommodation.rating || '4.95'} · {accommodation.reviews || 0} reviews</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <div style={{ width: '40px', height: '40px', backgroundColor: '#e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>S</div>
                    <div>
                      <h4 style={{ margin: 0 }}>Sarah</h4>
                      <p style={{ margin: 0, color: 'var(--text-light)', fontSize: '14px' }}>June 2026</p>
                    </div>
                  </div>
                  <p>Absolutely loved our stay. The host was incredible and the location was perfect!</p>
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <div style={{ width: '40px', height: '40px', backgroundColor: '#e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>M</div>
                    <div>
                      <h4 style={{ margin: 0 }}>Mike</h4>
                      <p style={{ margin: 0, color: 'var(--text-light)', fontSize: '14px' }}>May 2026</p>
                    </div>
                  </div>
                  <p>Very clean and spacious. We enjoyed the amenities and would definitely return.</p>
                </div>
              </div>
            </div>

            {/* Host Details */}
            <div style={{ padding: '32px 0', borderBottom: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <img src={accommodation.hostImage || "/images/placeholder_avatar.png"} alt="Host" onError={(e) => { e.target.onerror = null; e.target.src = '/images/placeholder_avatar.png'; }} style={{ width: '64px', height: '64px', borderRadius: '50%' }} />
                <div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '22px' }}>Hosted by {accommodation.hostName || 'Host'}</h3>
                  <p style={{ margin: 0, color: 'var(--text-light)' }}>Joined in 2021</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
                <span>⭐ 1,200 Reviews</span>
                <span>🛡️ Identity verified</span>
                <span>🏅 Superhost</span>
              </div>
              <p>As a host, my goal is to ensure you have a wonderful stay. Please reach out if you need anything.</p>
              <div style={{ marginTop: '24px' }}>
                <p style={{ margin: '0 0 8px 0' }}><strong>Language:</strong> English</p>
                <p style={{ margin: '0 0 8px 0' }}><strong>Response rate:</strong> 100%</p>
                <p style={{ margin: 0 }}><strong>Response time:</strong> within an hour</p>
              </div>
              <button className="btn" style={{ border: '1px solid var(--text-color)', backgroundColor: 'transparent', marginTop: '24px' }}>Contact Host</button>
            </div>

            {/* Things to know */}
            <div style={{ padding: '48px 0' }}>
              <h3 style={{ fontSize: '22px', marginBottom: '24px', fontWeight: '600' }}>Things to know</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                {/* Column 1: Cancellation policy */}
                <div>
                  <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false" style={{ display: 'block', height: '24px', width: '24px', fill: '#222222', marginBottom: '16px' }}>
                    <path d="M26 4h-4V1h-2v3h-8V1h-2v3H6a2 2 0 0 0-2 2v22a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zM6 6h4v3h2V6h8v3h2V6h4v4H6V6zm20 20H6V12h20v14zm-6-9h-8v6h8v-6zm-1.5 4.5l-2-2-2 2-.5-.5 2-2-2-2 .5-.5 2 2 2-2 .5.5-2 2 2 2-.5.5z"></path>
                  </svg>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '600', color: '#222222' }}>Cancellation policy</h4>
                  <p style={{ margin: '0 0 4px 0', color: '#717171', fontSize: '16px' }}>This reservation is non-refundable.</p>
                  <p style={{ margin: '0 0 16px 0', color: '#717171', fontSize: '16px' }}>Review this host's full policy for details.</p>
                  <a href="#" style={{ color: '#222222', fontSize: '16px', fontWeight: '500', textDecoration: 'underline' }}>Learn more</a>
                </div>

                {/* Column 2: House rules */}
                <div>
                  <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false" style={{ display: 'block', height: '24px', width: '24px', fill: '#222222', marginBottom: '16px' }}>
                    <path d="M22 1a11 11 0 0 1 7.12 19.36l-9.83 9.83a1 1 0 0 1-.7.29H13v-5h-3v-5H5v-5h3.79l6.32-6.32A11 11 0 0 1 22 1zm0 2a9 9 0 0 0-5.6 1.95L9.62 11.7A1 1 0 0 1 8.91 12H7v1h3v5h3v5h4.59l8.65-8.65A9 9 0 1 0 22 3zm3 4a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm0 2a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"></path>
                  </svg>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '600', color: '#222222' }}>House rules</h4>
                  <p style={{ margin: '0 0 4px 0', color: '#717171', fontSize: '16px' }}>Check-in after 2:00 PM</p>
                  <p style={{ margin: '0 0 4px 0', color: '#717171', fontSize: '16px' }}>Checkout before 10:00 AM</p>
                  <p style={{ margin: '0 0 16px 0', color: '#717171', fontSize: '16px' }}>{accommodation.guests} guests maximum</p>
                  <a href="#" style={{ color: '#222222', fontSize: '16px', fontWeight: '500', textDecoration: 'underline' }}>Learn more</a>
                </div>

                {/* Column 3: Safety & property */}
                <div>
                  <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false" style={{ display: 'block', height: '24px', width: '24px', fill: '#222222', marginBottom: '16px' }}>
                    <path d="M16 28c-11.7-6-14-13.5-14-18.2a.9.9 0 0 1 .7-.9L16 4l13.3 4.9a.9.9 0 0 1 .7.9C30 14.5 27.7 22 16 28zm0-25.9l-13.8 5A2.9 2.9 0 0 0 0 9.8c0 5 1.5 13.5 15.6 20.1a1 1 0 0 0 .8 0C30.5 23.3 32 14.8 32 9.8a2.9 2.9 0 0 0-2.2-2.7L16 2.1zM16 4v24c11.7-6 14-13.5 14-18.2a.9.9 0 0 0-.7-.9L16 4z"></path>
                  </svg>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '600', color: '#222222' }}>Safety & property</h4>
                  <p style={{ margin: '0 0 4px 0', color: '#717171', fontSize: '16px' }}>Pool/hot tub without a gate or lock</p>
                  <p style={{ margin: '0 0 4px 0', color: '#717171', fontSize: '16px' }}>Carbon monoxide alarm</p>
                  <p style={{ margin: '0 0 16px 0', color: '#717171', fontSize: '16px' }}>Smoke alarm</p>
                  <a href="#" style={{ color: '#222222', fontSize: '16px', fontWeight: '500', textDecoration: 'underline' }}>Learn more</a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Cost Calculator */}
          <div style={{ flex: '1' }}>
            <div style={{ border: '1px solid #dddddd', borderRadius: '12px', padding: '24px', boxShadow: '0 6px 16px rgba(0,0,0,0.12)', position: 'sticky', top: '120px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '24px' }}>
                <span style={{ fontSize: '26px', fontWeight: '800', color: '#222222' }}>{currencySymbol}{basePrice}</span>
                <span style={{ color: '#717171', fontSize: '16px' }}>night</span>
              </div>

              <div style={{ border: '1px solid #b0b0b0', borderRadius: '8px', marginBottom: '16px', overflow: 'hidden' }}>
                <div style={{ display: 'flex', borderBottom: '1px solid #b0b0b0' }}>
                  <div style={{ flex: 1, padding: '12px', borderRight: '1px solid #b0b0b0' }}>
                    <label style={{ display: 'block', fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', marginBottom: '4px', color: '#222222' }}>Check-In</label>
                    <input type="date" min={new Date().toISOString().split('T')[0]} value={startDate} onChange={e => setStartDate(e.target.value)} style={{ width: '100%', border: 'none', outline: 'none', fontSize: '14px', fontFamily: 'inherit', padding: 0, color: '#222222' }} />
                  </div>
                  <div style={{ flex: 1, padding: '12px' }}>
                    <label style={{ display: 'block', fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', marginBottom: '4px', color: '#222222' }}>Check-Out</label>
                    <input type="date" min={startDate || new Date().toISOString().split('T')[0]} value={endDate} onChange={e => setEndDate(e.target.value)} style={{ width: '100%', border: 'none', outline: 'none', fontSize: '14px', fontFamily: 'inherit', padding: 0, color: '#222222' }} />
                  </div>
                </div>
                <div style={{ padding: '12px', position: 'relative' }}>
                  <label style={{ display: 'block', fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', marginBottom: '4px', color: '#222222' }}>Guests</label>
                  <select value={guests} onChange={e => setGuests(Number(e.target.value))} style={{ width: '100%', border: 'none', outline: 'none', backgroundColor: 'transparent', fontSize: '14px', appearance: 'none', fontFamily: 'inherit', padding: 0, cursor: 'pointer', color: '#222222' }}>
                    {[...Array(accommodation.guests || 4)].map((_, i) => (
                      <option key={i+1} value={i+1}>{i+1} {i === 0 ? 'guest' : 'guests'}</option>
                    ))}
                  </select>
                  <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', fill: 'none', stroke: '#222222', strokeWidth: '4', overflow: 'visible', pointerEvents: 'none' }} aria-hidden="true" role="presentation" focusable="false"><path d="m28 12-11.2928932 11.2928932c-.3905243.3905243-1.0236893.3905243-1.4142136 0l-11.2928932-11.2928932"></path></svg>
                </div>
              </div>

              {reserveError && <div style={{ color: '#dc2626', marginBottom: '16px', fontSize: '14px' }}>{reserveError}</div>}
              {reserveSuccess && <div style={{ color: '#16a34a', marginBottom: '16px', fontSize: '14px', fontWeight: '500' }}>{reserveSuccess}</div>}

              <button onClick={handleReserve} style={{ width: '100%', padding: '14px', fontSize: '16px', marginBottom: '24px', backgroundColor: '#e31c5f', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', transition: 'background-color 0.2s' }} onMouseOver={(e) => e.target.style.backgroundColor = '#d01050'} onMouseOut={(e) => e.target.style.backgroundColor = '#e31c5f'}>
                Reserve
              </button>

              <div style={{ textAlign: 'center', color: '#717171', fontSize: '14px', marginBottom: '24px' }}>
                You won't be charged yet
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderBottom: '1px solid #ebebeb', paddingBottom: '24px', marginBottom: '24px', fontSize: '16px', color: '#222222' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ textDecoration: 'underline' }}>{currencySymbol}{basePrice} x {nights} {nights === 1 ? 'night' : 'nights'}</span>
                  <span>{currencySymbol}{totalNightsCost}</span>
                </div>
                {weeklyDiscount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16a34a' }}>
                    <span>Weekly discount</span>
                    <span>-{currencySymbol}{weeklyDiscount}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ textDecoration: 'underline' }}>Cleaning fee</span>
                  <span>{currencySymbol}{cleaningFee}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ textDecoration: 'underline' }}>Service fee</span>
                  <span>{currencySymbol}{serviceFee}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ textDecoration: 'underline' }}>Occupancy taxes and fees</span>
                  <span>{currencySymbol}{occupancyTaxes}</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '800', fontSize: '16px', color: '#222222' }}>
                <span>Total before taxes</span>
                <span>{currencySymbol}{total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />

      {/* Modern Success Modal */}
      {showSuccessModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 2000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '16px', width: '400px', maxWidth: '90%', boxShadow: '0 8px 28px rgba(0,0,0,0.28)', position: 'relative', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', backgroundColor: '#e8fdf0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: '#16a34a' }}>
              <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', height: '32px', width: '32px', fill: 'currentcolor' }}>
                <path d="M16 2a14 14 0 1 0 14 14A14 14 0 0 0 16 2zm-2.5 21L6 15.5l1.5-1.5 6 6 11-11 1.5 1.5-12.5 12.5z"></path>
              </svg>
            </div>
            <h3 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '12px', color: '#222' }}>Reservation successful!</h3>
            <p style={{ fontSize: '16px', color: '#717171', marginBottom: '32px' }}>Your trip has been booked. You can view your reservation details in your account.</p>
            <button 
              onClick={() => {
                setShowSuccessModal(false);
                navigate('/view-reservations');
              }}
              style={{ width: '100%', padding: '14px', fontSize: '16px', backgroundColor: '#e31c5f', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', transition: 'background-color 0.2s' }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#d70466'} 
              onMouseOut={(e) => e.target.style.backgroundColor = '#e31c5f'}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default LocationDetails;
