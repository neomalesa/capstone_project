import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const CreateListingForm = ({ setActiveTab }) => {
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '', location: '', description: '', type: 'Entire apartment',
    price: '', guests: 1, bedrooms: 1, bathrooms: 1, amenities: []
  });

  const [imageFiles, setImageFiles] = useState([]); 
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const predefinedAmenities = [
    'Wifi', 'Air conditioning', 'Free parking', 'Kitchen', 'Pool', 
    'Hot tub', 'Gym', 'Heating', 'Washer', 'Dryer', 'TV', 'Workspace'
  ];
  const [selectedAmenity, setSelectedAmenity] = useState(predefinedAmenities[0]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

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
    const promises = files.map(file => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });
    });

    Promise.all(promises).then(base64Files => {
      setImageFiles(base64Files);
    }).catch(err => {
      setError('Error reading image files. Try again.');
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (!formData.title || formData.title.length < 3) return setError('Title must be at least 3 characters long.') || setIsSubmitting(false);
    if (!formData.location || formData.location.length < 2) return setError('Please enter a valid Location.') || setIsSubmitting(false);
    if (!formData.price || Number(formData.price) <= 0) return setError('Price must be greater than 0.') || setIsSubmitting(false);

    const payload = new FormData();
    payload.append('title', formData.title);
    payload.append('location', formData.location);
    payload.append('description', formData.description);
    payload.append('type', formData.type);
    payload.append('price', Number(formData.price));
    payload.append('guests', Number(formData.guests));
    payload.append('bedrooms', Number(formData.bedrooms));
    payload.append('bathrooms', Number(formData.bathrooms));
    payload.append('amenities', JSON.stringify(formData.amenities));

    if (imageFiles.length > 0) payload.append('images', JSON.stringify(imageFiles));

    try {
      await axios.post('/api/accommodations', payload, { headers: { 'Content-Type': 'multipart/form-data' } });
      setActiveTab('listings'); // Redirect back to listings
    } catch (err) {
      setIsSubmitting(false);
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div>
      {error && <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '12px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center' }}>{error}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '20px' }}>
          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', gridColumn: '1 / 2' }}>
            <div>
              <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px', fontSize: '14px' }}>Listing Title</label>
              <input name="title" value={formData.title} onChange={handleChange} placeholder="Charming House in Paris" required style={{ width: '100%', padding: '10px 12px', border: '1px solid #b0b0b0', borderRadius: '8px', fontSize: '14px' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px', fontSize: '14px' }}>Location</label>
              <input name="location" value={formData.location} onChange={handleChange} placeholder="Paris" required style={{ width: '100%', padding: '10px 12px', border: '1px solid #b0b0b0', borderRadius: '8px', fontSize: '14px' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px', fontSize: '14px' }}>Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows="6" style={{ width: '100%', padding: '10px 12px', border: '1px solid #b0b0b0', borderRadius: '8px', fontSize: '14px', resize: 'vertical' }}></textarea>
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px', fontSize: '14px' }}>Amenities</label>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <select value={selectedAmenity} onChange={(e) => setSelectedAmenity(e.target.value)} style={{ flex: 1, padding: '10px 12px', border: '1px solid #b0b0b0', borderRadius: '8px', fontSize: '14px' }}>
                  {predefinedAmenities.map(amenity => <option key={amenity} value={amenity}>{amenity}</option>)}
                </select>
                <button type="button" onClick={handleAddAmenity} style={{ backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '6px', padding: '0 20px', fontWeight: '500', cursor: 'pointer' }}>Add</button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {formData.amenities.map(amenity => (
                  <div key={amenity} style={{ display: 'flex', alignItems: 'center', backgroundColor: '#f3f4f6', padding: '6px 12px', borderRadius: '16px', fontSize: '13px', color: '#374151' }}>
                    {amenity}
                    <button type="button" onClick={() => handleRemoveAmenity(amenity)} style={{ background: 'none', border: 'none', marginLeft: '6px', color: '#9ca3af', cursor: 'pointer', padding: 0 }}>x</button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Columns */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', gridColumn: '2 / 4' }}>
            <div style={{ display: 'flex', gap: '20px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px', fontSize: '14px' }}>Price</label>
                <input name="price" type="number" value={formData.price} onChange={handleChange} placeholder="60" required style={{ width: '100%', padding: '10px 12px', border: '1px solid #b0b0b0', borderRadius: '8px', fontSize: '14px' }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px', fontSize: '14px' }}>Type</label>
                <select name="type" value={formData.type} onChange={handleChange} style={{ width: '100%', padding: '10px 12px', border: '1px solid #b0b0b0', borderRadius: '8px', fontSize: '14px' }}>
                  <option value="Select an option">Select an option</option>
                  <option value="Entire apartment">Entire apartment</option>
                  <option value="Private room">Private room</option>
                  <option value="House">House</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px', fontSize: '14px' }}>Rooms</label>
                <input name="guests" type="number" min="1" value={formData.guests} onChange={handleChange} style={{ width: '100%', padding: '10px 12px', border: '1px solid #b0b0b0', borderRadius: '8px', fontSize: '14px' }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px', fontSize: '14px' }}>Baths</label>
                <input name="bathrooms" type="number" min="1" value={formData.bathrooms} onChange={handleChange} style={{ width: '100%', padding: '10px 12px', border: '1px solid #b0b0b0', borderRadius: '8px', fontSize: '14px' }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px', fontSize: '14px' }}>Beds</label>
                <input name="bedrooms" type="number" min="1" value={formData.bedrooms} onChange={handleChange} style={{ width: '100%', padding: '10px 12px', border: '1px solid #b0b0b0', borderRadius: '8px', fontSize: '14px' }} />
              </div>
            </div>

            <div>
              <button type="button" onClick={() => fileInputRef.current.click()} style={{ backgroundColor: '#0056b3', color: 'white', border: 'none', borderRadius: '6px', padding: '8px 16px', cursor: 'pointer', marginBottom: '12px' }}>Select Images</button>
              <input type="file" multiple accept="image/*" onChange={handleImageChange} ref={fileInputRef} style={{ display: 'none' }} />
              <div style={{ border: '1px solid #b0b0b0', borderRadius: '8px', minHeight: '100px', padding: '12px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {imageFiles.length === 0 ? <span style={{ color: '#717171', fontSize: '14px' }}>No images</span> : imageFiles.map((src, i) => <img key={i} src={src} alt="preview" style={{ width: '60px', height: '60px', objectFit: 'cover' }} />)}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', marginTop: 'auto', paddingTop: '20px' }}>
              <button type="submit" disabled={isSubmitting} style={{ flex: 1, backgroundColor: '#0056b3', color: 'white', border: 'none', borderRadius: '6px', padding: '12px', fontSize: '16px', cursor: isSubmitting ? 'not-allowed' : 'pointer', opacity: isSubmitting ? 0.7 : 1 }}>Create</button>
              <button type="button" onClick={() => setActiveTab('listings')} style={{ flex: 1, backgroundColor: '#e31c5f', color: 'white', border: 'none', borderRadius: '6px', padding: '12px', fontSize: '16px', cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateListingForm;
