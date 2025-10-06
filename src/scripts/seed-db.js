// This script is for development only
// It seeds the database with some initial data for testing

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dbConnect from '../lib/mongodb.js';

// Connect to MongoDB
dbConnect().then(async () => {
  try {
    // Import models
    const User = mongoose.models.User || mongoose.model('User', (await import('../models/User.js')).default.schema);
    
    console.log('Connected to MongoDB. Seeding database...');
    
    // Clear existing data
    await User.deleteMany({});
    console.log('Cleared existing users');
    
    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    await User.create({
      name: 'Admin User',
      email: 'admin@starlette.com',
      password: adminPassword,
      role: 'admin',
      phoneNumber: '123-456-7890'
    });
    console.log('Created admin user');
    
    // Create test user
    const userPassword = await bcrypt.hash('test123', 10);
    await User.create({
      name: 'Test User',
      email: 'test@starlette.com',
      password: userPassword,
      role: 'user',
      phoneNumber: '987-654-3210'
    });
    console.log('Created test user');
    
    console.log('Database seeding completed successfully!');
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    process.exit(0);
  }
}).catch(error => {
  console.error('Failed to connect to MongoDB:', error);
  process.exit(1);
});