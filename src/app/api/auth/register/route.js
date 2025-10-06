import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { generateToken } from '@/lib/tokens';

export async function POST(request) {
  try {
    // Connect to the database
    await dbConnect();
    
    const body = await request.json();
    const { 
      firstName, 
      lastName, 
      email, 
      password, 
      confirmPassword,
      phoneNumber,
      address,
      city,
      zipCode,
      country,
      agreedToTerms 
    } = body;
    
    // Validate inputs
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { message: 'Missing required fields' }, 
        { status: 400 }
      );
    }
    
    if (password !== confirmPassword) {
      return NextResponse.json(
        { message: 'Passwords do not match' }, 
        { status: 400 }
      );
    }
    
    if (!agreedToTerms) {
      return NextResponse.json(
        { message: 'You must agree to the terms and conditions' }, 
        { status: 400 }
      );
    }
    
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: 'Email already registered' }, 
        { status: 409 }
      );
    }
    
    // Create new user
    const newUser = new User({
      name: `${firstName} ${lastName}`, // Combining first and last name
      email,
      password, // Will be hashed automatically by the User model pre-save hook
      phoneNumber,
      // Store address data in a more structured way if needed
      address: {
        street: address,
        city,
        zipCode,
        country
      }
    });
    
    // Save user to database
    await newUser.save();
    
    // Generate JWT token
    const token = generateToken(newUser._id);
    
    // Return user data (excluding password) and token
    const userObject = newUser.toObject();
    delete userObject.password;
    
    return NextResponse.json({
      message: 'Registration successful',
      user: userObject,
      token
    }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Registration failed', error: error.message }, 
      { status: 500 }
    );
  }
}