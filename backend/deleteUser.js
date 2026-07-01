const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    await mongoose.connection.db.collection('users').deleteOne({ email: 'nmalesa16@gmail.com' });
    console.log("Deleted user nmalesa16@gmail.com so they can recreate it with a new password");
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
