require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Accommodation = require('./models/Accommodation');

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for Seeding...');

    // 1. Create an Admin Host if none exists
    let admin = await User.findOne({ email: 'admin@admin.com' });
    if (!admin) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password123', salt);
      admin = new User({
        email: 'admin@admin.com',
        username: 'AdminHost',
        password: hashedPassword,
        role: 'admin'
      });
      await admin.save();
      console.log('Created default admin: admin@admin.com / password123');
    }

    // 2. Clear existing accommodations to avoid duplicates
    await Accommodation.deleteMany({});
    console.log('Cleared old accommodations.');

    // 3. Create realistic sample accommodations for the required locations
    const accommodations = [
      {
        title: 'Modern Loft in Manhattan',
        location: 'New York',
        description: 'Experience the heart of NYC in this beautiful, sun-drenched loft. Steps away from Times Square and Central Park.',
        type: 'Entire apartment',
        price: 950,
        guests: 4,
        bedrooms: 2,
        bathrooms: 2,
        images: [
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1502672260266-1c1f54117865?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80'
        ],
        amenities: ['Wifi', 'Kitchen', 'Air conditioning', 'Heating', 'TV'],
        host: admin._id,
        hostName: admin.username,
        rating: 4.9,
        reviews: 120,
        weeklyDiscount: 10,
        cleaningFee: 150,
        serviceFee: 25,
        occupancyTaxes: 15
      },
      {
        title: 'Romantic Suite with Eiffel Tower View',
        location: 'Paris',
        description: 'Wake up to breathtaking views of the Eiffel Tower. This luxurious Parisian apartment is perfect for couples.',
        type: 'Entire apartment',
        price: 1200,
        guests: 2,
        bedrooms: 1,
        bathrooms: 1,
        images: [
          'https://images.unsplash.com/photo-1502602881226-54056262450d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1522050212171-61b01dd24579?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80'
        ],
        amenities: ['Wifi', 'Kitchen', 'Balcony', 'Coffee maker'],
        host: admin._id,
        hostName: admin.username,
        rating: 4.95,
        reviews: 340,
        weeklyDiscount: 15,
        cleaningFee: 200,
        serviceFee: 30,
        occupancyTaxes: 20
      },
      {
        title: 'Traditional Ryokan Stay in Shinjuku',
        location: 'Tokyo',
        description: 'Authentic Japanese living experience right in the middle of vibrant Tokyo. Features tatami mats and futon bedding.',
        type: 'Private room',
        price: 450,
        guests: 3,
        bedrooms: 1,
        bathrooms: 1,
        images: [
          'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1528360983277-13d401cdc186?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80'
        ],
        amenities: ['Wifi', 'Air conditioning', 'Essentials', 'Hair dryer'],
        host: admin._id,
        hostName: admin.username,
        rating: 4.8,
        reviews: 85,
        weeklyDiscount: 5,
        cleaningFee: 70,
        serviceFee: 15,
        occupancyTaxes: 10
      },
      {
        title: 'Stunning Villa with Ocean Views',
        location: 'Cape Town',
        description: 'Luxurious villa perched on the cliffs overlooking the Atlantic. Includes a private infinity pool and wrap-around deck.',
        type: 'Villa',
        price: 1500,
        guests: 8,
        bedrooms: 4,
        bathrooms: 3,
        images: [
          'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80'
        ],
        amenities: ['Wifi', 'Pool', 'Kitchen', 'Free parking', 'BBQ grill'],
        host: admin._id,
        hostName: admin.username,
        rating: 5.0,
        reviews: 42,
        weeklyDiscount: 50,
        cleaningFee: 250,
        serviceFee: 50,
        occupancyTaxes: 45
      },
      {
        title: 'Beachfront Bungalow in Phuket',
        location: 'Thailand',
        description: 'Step directly from your front door onto the white sands. A tranquil paradise getaway surrounded by palm trees.',
        type: 'House',
        price: 550,
        guests: 2,
        bedrooms: 1,
        bathrooms: 1,
        images: [
          'https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80'
        ],
        amenities: ['Wifi', 'Beachfront', 'Air conditioning', 'Patio'],
        host: admin._id,
        hostName: admin.username,
        rating: 4.75,
        reviews: 210,
        weeklyDiscount: 20,
        cleaningFee: 80,
        serviceFee: 20,
        occupancyTaxes: 12
      }
    ];

    await Accommodation.insertMany(accommodations);
    console.log('Successfully seeded database with 5 luxury accommodations!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedDB();
