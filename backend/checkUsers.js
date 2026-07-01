const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    const users = await mongoose.connection.db.collection('users').find({}).toArray();
    console.log("Users:", users.map(u => ({email: u.email, role: u.role})));
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
