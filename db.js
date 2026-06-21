const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  try {
    // Timeout quickly (2.5 seconds) if local MongoDB service is not started
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommerce', {
      serverSelectionTimeoutMS: 2500
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    isConnected = true;
  } catch (error) {
    console.warn(`\n⚠️  Database Connection Warning: ${error.message}`);
    console.warn(`👉 Running in LOCAL FILE MODE (JSON File database fallback active: db.json).`);
    console.warn(`   No local MongoDB installation or service run is required to test!`);
    isConnected = false;
  }
};

const getIsConnected = () => isConnected;

module.exports = { connectDB, getIsConnected };
