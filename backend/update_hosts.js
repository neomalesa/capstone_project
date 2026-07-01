const mongoose = require('mongoose');
require('dotenv').config();

const Accommodation = require('./models/Accommodation.js');

const names = [
  'Michael', 'Sarah', 'James', 'Emily', 'David', 'Jessica', 'Robert', 'Ashley', 
  'John', 'Amanda', 'Christopher', 'Melissa', 'Matthew', 'Stephanie', 'Joshua', 
  'Nicole', 'Daniel', 'Elizabeth', 'Andrew', 'Samantha', 'Joseph', 'Lauren', 
  'William', 'Megan', 'Anthony', 'Rachel', 'Justin', 'Hannah', 'Ryan', 'Michelle',
  'Alexander', 'Emma', 'Ethan', 'Olivia', 'Jacob', 'Sophia', 'William', 'Ava',
  'Benjamin', 'Isabella', 'Elijah', 'Mia', 'Daniel', 'Charlotte', 'Matthew', 'Amelia'
];

async function updateHosts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const accommodations = await Accommodation.find({});
    
    for (let acc of accommodations) {
      const randomName = names[Math.floor(Math.random() * names.length)];
      acc.hostName = randomName;
      await acc.save();
    }
    
    console.log(`Updated ${accommodations.length} accommodations with random English names.`);
    process.exit(0);
  } catch (error) {
    console.error('Error updating accommodations:', error);
    process.exit(1);
  }
}

updateHosts();
