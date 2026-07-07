import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import axios from 'axios';

const CreateListing = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isUpdate = !!id;
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    location: '',
    description: '',
    type: 'Entire apartment',
    price: '',
    guests: 1, // Rooms/Guests
    bedrooms: 1,
    bathrooms: 1,
    amenities: []
  });

  const [imageFiles, setImageFiles] = useState([]); // Array of base64 strings
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const predefinedAmenities = [
    'Wifi', 'Air conditioning', 'Free parking', 'Kitchen', 'Pool', 
    'Hot tub', 'Gym', 'Heating', 'Washer', 'Dryer', 'TV', 'Workspace'
  ];
  const [selectedAmenity, setSelectedAmenity] = useState(predefinedAmenities[0]);

  useEffect(() => {
    if (isUpdate) {
      axios.get('/api/accommodations').then(res => {
        const item = res.data.find(a => a._id === id);
        if (item) {
          setFormData({
            title: item.title,
            location: item.location,
            description: item.description,
            type: item.type,
            price: item.price,
            guests: item.guests,
            bedrooms: item.bedrooms,
            bathrooms: item.bathrooms,
            amenities: item.amenities || []
          });
          setImageFiles(item.images || []);
        }
      });
    }
  }, [id, isUpdate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddAmenity = () => {
    if (selectedAmenity && !formData.amenities.includes(selectedAmenity)) {
      setFormData({ ...formData, amenities: [...formData.amenities, selectedAmenity] });
    }
  };

  const handleRemoveAmenity = (amenity) => {
    setFormData({ ...formData, amenities: formData.amenities.filter(a => a !== amenity) });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Convert to Base64 to store directly in DB
    const promises = files.map(file => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });
    });

    Promise.all(promises).then(base64Files => {
      // Append or replace depending on how you want to handle it. Let's replace for simplicity
      setImageFiles(base64Files);
    }).catch(err => {
      console.error('Error converting images to base64:', err);
      setError('Error reading image files. Try again.');
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (!formData.title || formData.title.length < 3) {
      setIsSubmitting(false);
      return setError('Title must be at least 3 characters long.');
    }
    if (!formData.location || formData.location.length < 2) {
      setIsSubmitting(false);
      return setError('Please enter a valid Location.');
    }
    if (!formData.price || Number(formData.price) <= 0) {
      setIsSubmitting(false);
      return setError('Price must be greater than 0.');
    }

    const payload = new FormData();
    payload.append('title', formData.title);
    payload.append('location', formData.location);
    payload.append('description', formData.description);
    payload.append('type', formData.type);
    payload.append('price', Number(formData.price));
    payload.append('guests', Number(formData.guests)); // Represents Rooms in the sketch
    payload.append('bedrooms', Number(formData.bedrooms));
    payload.append('bathrooms', Number(formData.bathrooms));
    
    payload.append('amenities', JSON.stringify(formData.amenities));

    if (imageFiles.length > 0) {
      // Send as JSON array string for the backend to parse
      payload.append('images', JSON.stringify(imageFiles));
    }

    try {
      if (isUpdate) {
        await axios.put(`/api/accommodations/${id}`, payload, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await axios.post('/api/accommodations', payload, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      navigate('/host/dashboard');
    } catch (err) {
      setIsSubmitting(false);
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <>
      <Navbar />
      <div className="page-content" style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 20px', fontFamily: 'inherit' }}>
        
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '600', color: '#222222', margin: 0 }}>
            {isUpdate ? 'Update your listing' : 'Create a new listing'}
          </h1>
          <p style={{ color: '#717171', fontSize: '16px', marginTop: '8px' }}>
            Fill out the details below to {isUpdate ? 'update your property information.' : 'start hosting your property.'}
          </p>
        </div>
        
        {error && <div style={{ backgroundColor: '#fff8f6', border: '1px solid #ffdbd2', color: '#c13515', padding: '16px', borderRadius: '8px', marginBottom: '24px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', height: '20px', width: '20px', fill: 'currentcolor' }}><path d="M16 2a14 14 0 1 0 14 14A14 14 0 0 0 16 2zm0 26a12 12 0 1 1 12-12 12 12 0 0 1-12 12z"></path><path d="M16 10a2 2 0 1 0 2 2 2 2 0 0 0-2-2zM15 16h2v8h-2z"></path></svg>
          {error}
        </div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
            {/* Left Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', fontSize: '16px', color: '#222222' }}>Listing Title</label>
                <input name="title" value={formData.title} onChange={handleChange} placeholder="Charming House in Paris" required style={{ width: '100%', padding: '14px', border: '1px solid #b0b0b0', borderRadius: '8px', fontSize: '16px', outline: 'none', transition: 'border-color 0.2s', fontFamily: 'inherit' }} onFocus={(e) => e.target.style.borderColor = '#222222'} onBlur={(e) => e.target.style.borderColor = '#b0b0b0'} />
              </div>
              
              <div>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', fontSize: '16px', color: '#222222' }}>Location</label>
                <input name="location" value={formData.location} onChange={handleChange} placeholder="Paris" required style={{ width: '100%', padding: '14px', border: '1px solid #b0b0b0', borderRadius: '8px', fontSize: '16px', outline: 'none', transition: 'border-color 0.2s', fontFamily: 'inherit' }} onFocus={(e) => e.target.style.borderColor = '#222222'} onBlur={(e) => e.target.style.borderColor = '#b0b0b0'} />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', fontSize: '16px', color: '#222222' }}>Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows="6" style={{ width: '100%', padding: '14px', border: '1px solid #b0b0b0', borderRadius: '8px', fontSize: '16px', resize: 'vertical', outline: 'none', transition: 'border-color 0.2s', fontFamily: 'inherit' }} onFocus={(e) => e.target.style.borderColor = '#222222'} onBlur={(e) => e.target.style.borderColor = '#b0b0b0'} placeholder="Enjoy a fabulous stay at this wonderful location..."></textarea>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', fontSize: '16px', color: '#222222' }}>Amenities</label>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                  <select 
                    value={selectedAmenity} 
                    onChange={(e) => setSelectedAmenity(e.target.value)} 
                    style={{ flex: 1, padding: '14px', border: '1px solid #b0b0b0', borderRadius: '8px', fontSize: '16px', outline: 'none', fontFamily: 'inherit', backgroundColor: 'white' }}
                  >
                    {predefinedAmenities.map(amenity => (
                      <option key={amenity} value={amenity}>{amenity}</option>
                    ))}
                  </select>
                  <button 
                    type="button" 
                    onClick={handleAddAmenity}
                    style={{ backgroundColor: '#222222', color: 'white', border: 'none', borderRadius: '8px', padding: '0 24px', fontWeight: '600', cursor: 'pointer', fontSize: '16px', transition: 'background-color 0.2s' }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#000000'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#222222'}
                  >
                    Add
                  </button>
                </div>
                
                {/* Selected Amenities Pills */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                  {formData.amenities.map(amenity => (
                    <div key={amenity} style={{ display: 'flex', alignItems: 'center', backgroundColor: '#f7f7f7', border: '1px solid #dddddd', padding: '8px 16px', borderRadius: '24px', fontSize: '14px', color: '#222222', fontWeight: '500' }}>
                      {amenity}
                      <button 
                        type="button" 
                        onClick={() => handleRemoveAmenity(amenity)} 
                        style={{ background: 'none', border: 'none', marginLeft: '8px', color: '#717171', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
                      >
                        <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: '16px', height: '16px' }}><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'flex', gap: '24px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', fontSize: '16px', color: '#222222' }}>Price / night</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#222222', fontSize: '16px' }}>$</span>
                    <input name="price" type="number" value={formData.price} onChange={handleChange} placeholder="60" required style={{ width: '100%', padding: '14px 14px 14px 32px', border: '1px solid #b0b0b0', borderRadius: '8px', fontSize: '16px', outline: 'none', transition: 'border-color 0.2s', fontFamily: 'inherit', boxSizing: 'border-box' }} onFocus={(e) => e.target.style.borderColor = '#222222'} onBlur={(e) => e.target.style.borderColor = '#b0b0b0'} />
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', fontSize: '16px', color: '#222222' }}>Property Type</label>
                  <select name="type" value={formData.type} onChange={handleChange} style={{ width: '100%', padding: '14px', border: '1px solid #b0b0b0', borderRadius: '8px', fontSize: '16px', outline: 'none', fontFamily: 'inherit', backgroundColor: 'white', boxSizing: 'border-box' }}>
                    <option value="Select an option">Select an option</option>
                    <option value="Entire apartment">Entire apartment</option>
                    <option value="Private room">Private room</option>
                    <option value="House">House</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', fontSize: '14px', color: '#222222' }}>Guests</label>
                  <input name="guests" type="number" min="1" value={formData.guests} onChange={handleChange} placeholder="2" style={{ width: '100%', padding: '12px', border: '1px solid #b0b0b0', borderRadius: '8px', fontSize: '16px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', fontSize: '14px', color: '#222222' }}>Bedrooms</label>
                  <input name="bedrooms" type="number" min="1" value={formData.bedrooms} onChange={handleChange} placeholder="2" style={{ width: '100%', padding: '12px', border: '1px solid #b0b0b0', borderRadius: '8px', fontSize: '16px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', fontSize: '14px', color: '#222222' }}>Bathrooms</label>
                  <input name="bathrooms" type="number" min="1" value={formData.bathrooms} onChange={handleChange} placeholder="1" style={{ width: '100%', padding: '12px', border: '1px solid #b0b0b0', borderRadius: '8px', fontSize: '16px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                </div>
              </div>

              <div style={{ marginTop: '8px' }}>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', fontSize: '16px', color: '#222222' }}>Photos</label>
                <button 
                  type="button" 
                  onClick={() => fileInputRef.current.click()}
                  style={{ 
                    backgroundColor: 'transparent', 
                    color: '#222222', 
                    border: '1px solid #222222', 
                    borderRadius: '8px', 
                    padding: '12px 24px', 
                    fontSize: '16px', 
                    fontWeight: '600',
                    cursor: 'pointer',
                    marginBottom: '16px',
                    transition: 'background-color 0.2s',
                    width: '100%'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#f7f7f7'}
                  onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  Upload Images
                </button>
                <input 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  onChange={handleImageChange} 
                  ref={fileInputRef} 
                  style={{ display: 'none' }} 
                />
                
                {imageFiles.length > 0 && (
                  <div style={{ 
                    border: '1px solid #dddddd', 
                    borderRadius: '8px', 
                    padding: '16px',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
                    gap: '12px',
                    backgroundColor: '#fafafa'
                  }}>
                    {imageFiles.map((src, i) => (
                      <div key={i} style={{ aspectRatio: '1', borderRadius: '8px', overflow: 'hidden', border: '1px solid #ebebeb' }}>
                        <img src={src} alt="preview" onError={(e) => { e.target.onerror = null; e.target.src = '/images/placeholder_main.png'; }} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '16px', marginTop: 'auto', paddingTop: '32px', borderTop: '1px solid #ebebeb' }}>
                <button 
                  type="button" 
                  onClick={() => navigate('/host/dashboard')} 
                  style={{ 
                    flex: 1, 
                    backgroundColor: 'transparent', 
                    color: '#222222', 
                    border: '1px solid #222222', 
                    borderRadius: '8px', 
                    padding: '14px', 
                    fontSize: '16px', 
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#f7f7f7'}
                  onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  style={{ 
                    flex: 1, 
                    background: 'linear-gradient(to right, #E61E4D 0%, #E31C5F 50%, #D70466 100%)', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '8px', 
                    padding: '14px', 
                    fontSize: '16px', 
                    fontWeight: '600',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    opacity: isSubmitting ? 0.7 : 1,
                    transition: 'opacity 0.2s'
                  }}
                  onMouseOver={(e) => !isSubmitting && (e.target.style.opacity = 0.9)} 
                  onMouseOut={(e) => !isSubmitting && (e.target.style.opacity = 1)}
                >
                  {isSubmitting ? 'Saving...' : (isUpdate ? 'Save changes' : 'Publish listing')}
                </button>
              </div>

            </div>
          </div>

        </form>
      </div>
    </>
  );
};

export default CreateListing;
