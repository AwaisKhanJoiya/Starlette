import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { authMiddleware } from '@/middleware/auth';

export async function GET(request) {
  try {
    // Connect to database
    await dbConnect();
    
    // Authenticate user using middleware
    const auth = await authMiddleware(request);
    
    if (!auth.success) {
      return auth.response;
    }
    
    // User is now authenticated, auth.user contains the user document
    
    return NextResponse.json({
      user: auth.user
    });
    
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch profile', error: error.message }, 
      { status: 500 }
    );
  }
}

// Update user profile
export async function PUT(request) {
  try {
    await dbConnect();
    
    // Authenticate user
    const auth = await authMiddleware(request);
    
    if (!auth.success) {
      return auth.response;
    }
    
    // Get updated profile data
    const body = await request.json();
    const { name, phoneNumber, address } = body;
    
    // Update only the fields that are provided
    const updateData = {};
    if (name) updateData.name = name;
    if (phoneNumber) updateData.phoneNumber = phoneNumber;
    if (address) updateData.address = address;
    
    // Update the user in database
    const updatedUser = await User.findByIdAndUpdate(
      auth.user._id,
      { $set: updateData },
      { new: true, runValidators: true } // Return updated document and run validators
    ).select('-password');
    
    return NextResponse.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
    
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { message: 'Failed to update profile', error: error.message }, 
      { status: 500 }
    );
  }
}