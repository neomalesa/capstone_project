const Accommodation = require('../models/Accommodation');

exports.createAccommodation = async (req, res) => {
  try {
    let images = [];
    
    // Parse uploaded files
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => `/uploads/${file.filename}`);
    } else if (req.body.images) {
      // Fallback if images were sent as string URLs
      try {
        images = JSON.parse(req.body.images);
      } catch (e) {
        images = req.body.images.split(',').map(i => i.trim()).filter(Boolean);
      }
    }

    let amenities = req.body.amenities || [];
    if (typeof amenities === 'string') {
      try {
        amenities = JSON.parse(amenities);
      } catch (e) {
        amenities = amenities.split(',').map(i => i.trim()).filter(Boolean);
      }
    }

    const newAccommodation = new Accommodation({
      ...req.body,
      images,
      amenities,
      host: req.user.id, // from auth middleware
      hostName: req.user.username
    });
    
    const savedAccommodation = await newAccommodation.save();
    res.status(201).json(savedAccommodation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllAccommodations = async (req, res) => {
  try {
    const accommodations = await Accommodation.find();
    res.json(accommodations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteAccommodation = async (req, res) => {
  try {
    const accommodation = await Accommodation.findById(req.params.id);
    if (!accommodation) {
      return res.status(404).json({ message: 'Accommodation not found' });
    }
    
    // Check if the user is the host or admin
    if (accommodation.host.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized to delete this listing' });
    }
    
    await Accommodation.findByIdAndDelete(req.params.id);
    res.json({ message: 'Accommodation deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Also let's add update accommodation
exports.updateAccommodation = async (req, res) => {
  try {
    const accommodation = await Accommodation.findById(req.params.id);
    if (!accommodation) {
      return res.status(404).json({ message: 'Accommodation not found' });
    }
    
    if (accommodation.host.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized to update this listing' });
    }

    let images = accommodation.images;
    if (req.files && req.files.length > 0) {
      // If new files are uploaded, append them (or replace, depending on logic. Let's replace for simplicity or just append)
      images = req.files.map(file => `/uploads/${file.filename}`);
    } else if (req.body.images) {
      try {
        images = JSON.parse(req.body.images);
      } catch (e) {
        images = req.body.images.split(',').map(i => i.trim()).filter(Boolean);
      }
    }

    let amenities = req.body.amenities || accommodation.amenities;
    if (typeof amenities === 'string') {
      try {
        amenities = JSON.parse(amenities);
      } catch (e) {
        amenities = amenities.split(',').map(i => i.trim()).filter(Boolean);
      }
    }
    
    const updateData = { ...req.body, images, amenities };

    const updatedAccommodation = await Accommodation.findByIdAndUpdate(
      req.params.id, 
      { $set: updateData }, 
      { new: true }
    );
    res.json(updatedAccommodation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
