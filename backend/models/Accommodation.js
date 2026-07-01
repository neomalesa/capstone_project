const mongoose = require('mongoose');

const specificRatingsSchema = new mongoose.Schema({
  cleanliness: { type: Number, default: 0 },
  communication: { type: Number, default: 0 },
  checkIn: { type: Number, default: 0 },
  accuracy: { type: Number, default: 0 },
  location: { type: Number, default: 0 },
  value: { type: Number, default: 0 },
});

const accommodationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  type: { type: String }, // e.g., "Entire apartment"
  location: { type: String, required: true },
  guests: { type: Number, default: 1 },
  bedrooms: { type: Number, default: 1 },
  bathrooms: { type: Number, default: 1 },
  amenities: [{ type: String }],
  price: { type: Number, required: true }, // price per night
  images: [{ type: String }],
  host: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  hostName: { type: String },
  hostImage: { type: String },
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  weeklyDiscount: { type: Number, default: 0 },
  cleaningFee: { type: Number, default: 0 },
  serviceFee: { type: Number, default: 0 },
  occupancyTaxes: { type: Number, default: 0 },
  enhancedCleaning: { type: Boolean, default: false },
  selfCheckIn: { type: Boolean, default: false },
  specificRatings: specificRatingsSchema
}, { timestamps: true });

module.exports = mongoose.model('Accommodation', accommodationSchema);
