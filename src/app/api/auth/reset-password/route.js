import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Token from '@/models/Token';

export async function POST(request) {
  try {
    // Connect to database
    await dbConnect();
    
    const body = await request.json();
    const { token, newPassword } = body;
    
    if (!token || !newPassword) {
      return NextResponse.json(
        { message: 'Token and new password are required' }, 
        { status: 400 }
      );
    }
    
    // Find the token in database
    const resetToken = await Token.findOne({
      token,
      type: 'password-reset'
    });
    
    if (!resetToken) {
      return NextResponse.json(
        { message: 'Invalid or expired reset token' }, 
        { status: 400 }
      );
    }
    
    // Find the user
    const user = await User.findById(resetToken.userId);
    
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' }, 
        { status: 404 }
      );
    }
    
    // Update the password
    user.password = newPassword; // Will be hashed by pre-save hook
    await user.save();
    
    // Remove the used token
    await Token.findByIdAndDelete(resetToken._id);
    
    return NextResponse.json({
      message: 'Password has been reset successfully'
    });
    
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { message: 'Failed to reset password', error: error.message }, 
      { status: 500 }
    );
  }
}