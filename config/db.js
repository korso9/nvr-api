const mongoose = require('mongoose');

const connectDB = () => {
  mongoose.connect(process.env.MONGO_URI, (err) => {
    if (err) {
      console.log(`Database error: ${err.message}`);
      process.exit(1);
    } else console.log('Database connected...');
  });
};

module.exports = connectDB;
