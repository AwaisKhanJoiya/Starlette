import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { verifyToken, extractTokenFromHeader } from '@/lib/tokens';
import User from '@/models/User';

export async function GET(request) {
  try {
    // Connect to database
    await dbConnect();
    
    // Extract token from Authorization header
    const token = extractTokenFromHeader(request);
    
    if (!token) {
      return NextResponse.json(
        { valid: false, message: 'No token provided' }, 
        { status: 401 }
      );
    }
    
    // Verify token
    const decoded = verifyToken(token);
    
    // If token is invalid or expired
    if (!decoded) {
      return NextResponse.json(
        { valid: false, message: 'Invalid or expired token' }, 
        { status: 401 }
      );
    }
    
    // Verify if user exists
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return NextResponse.json(
        { valid: false, message: 'User not found' }, 
        { status: 404 }
      );
    }
    
    // If no error is thrown during verification, token is valid
    return NextResponse.json({
      valid: true,
      message: 'Token is valid',
      user
    });
    
  } catch (error) {
    console.error('Token validation error:', error);
    return NextResponse.json(
      { valid: false, message: 'Invalid or expired token', error: error.message }, 
      { status: 401 }
    );
  }
}