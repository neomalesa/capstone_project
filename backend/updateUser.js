const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    await mongoose.connection.db.collection('users').updateOne({ email: 'nmalesa16@gmail.com' }, { $set: { username: 'Neo' } });
    console.log("Updated username to Neo");
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
