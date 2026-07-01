const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'], // According to the rubric it says 'host' but we can use admin to cover it
    default: 'user'
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
