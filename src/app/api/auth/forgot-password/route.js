import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Token from '@/models/Token';
import { generateResetToken } from '@/lib/tokens';

export async function POST(request) {
  try {
    // Connect to database
    await dbConnect();
    
    const body = await request.json();
    const { email } = body;
    
    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' }, 
        { status: 400 }
      );
    }
    
    // Find user by email
    const user = await User.findOne({ email });
    
    // Even if we don't find the user, we should return a success message
    // This prevents email enumeration attacks
    if (!user) {
      console.log(`Password reset requested for non-existent email: ${email}`);
      return NextResponse.json({
        message: 'If your email is registered, you will receive password reset instructions'
      });
    }
    
    // Generate a password reset token
    const resetToken = generateResetToken();
    
    // Store the token in the database
    await Token.create({
      userId: user._id,
      token: resetToken,
      type: 'password-reset'
      // Using the expires property in the schema (3600 seconds)
    });
    
    // In a real application, send an email with the reset link
    // For demo purposes, we'll just log it
    console.log(`Password reset link for ${email}: /reset-password?token=${resetToken}`);
    
    return NextResponse.json({
      message: 'If your email is registered, you will receive password reset instructions'
    });
    
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { message: 'Failed to process request', error: error.message }, 
      { status: 500 }
    );
  }
}