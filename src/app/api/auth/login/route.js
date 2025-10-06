import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { generateToken } from '@/lib/tokens';

export async function POST(request) {
  try {
    // Connect to the database
    await dbConnect();
    
    const body = await request.json();
    const { email, password } = body;
    
    // Validate inputs
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' }, 
        { status: 400 }
      );
    }
    
    // Find user by email and explicitly select password field
    const user = await User.findOne({ email }).select('+password');
    
    // User doesn't exist
    if (!user) {
      return NextResponse.json(
        { message: 'Invalid email or password' }, 
        { status: 401 }
      );
    }
    
    // Check if password matches
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return NextResponse.json(
        { message: 'Invalid email or password' }, 
        { status: 401 }
      );
    }
    
    // Generate JWT token
    const token = generateToken(user._id);
    
    // Return user data (excluding password) and token
    const userObject = user.toObject();
    delete userObject.password;
    
    return NextResponse.json({
      message: 'Login successful',
      user: userObject,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Login failed', error: error.message }, 
      { status: 500 }
    );
  }
}