import dbConnect from '../lib/mongodb.js';

async function testConnection() {
  try {
    const mongoose = await dbConnect();
    console.log('Successfully connected to MongoDB!');
    console.log(`MongoDB connection string: ${mongoose.connection.host}:${mongoose.connection.port}/${mongoose.connection.name}`);
    console.log('Connection state:', mongoose.connection.readyState === 1 ? 'Connected' : 'Not connected');
    
    // Close the connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
}

// Run the test
testConnection();