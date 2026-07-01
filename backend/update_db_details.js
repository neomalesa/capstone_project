const mongoose = require('mongoose');
require('dotenv').config();

const Accommodation = require('./models/Accommodation.js');

const descriptions = [
  'Experience the heart of the city in this beautiful, sun-drenched loft.\nSteps away from Times Square and Central Park.',
  'Enjoy a fabulous stay at this wonderful location.\nPerfect for families and groups looking to explore the local culture.',
  'Wake up to stunning views in this modern, luxurious apartment.\nFeatures a private balcony and premium amenities for a perfect getaway.',
  'A cozy and quiet retreat nestled in a vibrant neighborhood.\nWalking distance to the best cafes, restaurants, and shopping spots.',
  'Spacious and elegantly designed home with a touch of classic charm.\nIdeal for both short visits and extended stays with full kitchen access.'
];

const hostImages = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1527980965255-d3b416303d12?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80'
];

async function updateDbDetails() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Make sure schema supports hostImage if it doesn't already
    // Mongoose schema might not have hostImage explicitly, but since it's flexible or we can use strict: false, 
    // Wait, let's just use the Accommodation model. 
    // If strict is true and hostImage is not in schema, it won't save.
    // Let's check if strict is disabled or we can just use description for now.
    
    const accommodations = await Accommodation.find({});
    
    for (let acc of accommodations) {
      acc.description = descriptions[Math.floor(Math.random() * descriptions.length)];
      // Using set to bypass strict mode if hostImage isn't in schema
      acc.set('hostImage', hostImages[Math.floor(Math.random() * hostImages.length)], { strict: false });
      await acc.save();
    }
    
    console.log(`Updated ${accommodations.length} accommodations with new descriptions and host images.`);
    process.exit(0);
  } catch (error) {
    console.error('Error updating accommodations:', error);
    process.exit(1);
  }
}

updateDbDetails();
