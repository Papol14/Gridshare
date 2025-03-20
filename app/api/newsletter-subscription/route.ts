import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Newsletter, INewsletter } from '@/models/Newsletter';

export async function POST(request: Request) {
  try {
    // Check content type
    const contentType = request.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      return NextResponse.json(
        { error: 'Content-Type must be application/json' },
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Connect to MongoDB
    console.log('Attempting to connect to MongoDB...');
    await connectDB();
    console.log('Successfully connected to MongoDB');

    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch (error) {
      console.error('Failed to parse request body:', error);
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('Received newsletter subscription data:', body);
    
    const { email } = body;

    // Validate email
    if (!email?.trim()) {
      console.log('Validation error: Email is required');
      return NextResponse.json(
        { error: 'Email is required' },
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Validation error: Invalid email format');
      return NextResponse.json(
        { error: 'Invalid email format' },
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Validate email length
    if (email.length > 100) {
      console.log('Validation error: Email is too long');
      return NextResponse.json(
        { error: 'Email is too long' },
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Check if email already exists
    console.log('Checking for existing subscription...');
    const existingSubscription = await Newsletter.findOne({ email: email.toLowerCase() });
    if (existingSubscription) {
      console.log('Duplicate subscription found:', existingSubscription.email);
      return NextResponse.json(
        { error: 'Email already subscribed' },
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Create new subscription
    console.log('Creating new newsletter subscription...');
    const subscription = await Newsletter.create({
      email: email.toLowerCase()
    });

    console.log('Newsletter subscription saved successfully:', {
      id: subscription._id,
      email: subscription.email,
      subscribedAt: subscription.subscribedAt
    });

    return NextResponse.json(
      { message: 'Successfully subscribed to newsletter' },
      { 
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error: any) {
    // Log error details
    console.error('Newsletter subscription error:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    if (error.stack) {
      console.error('Error stack:', error.stack);
    }

    // Handle specific MongoDB errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      console.error('Mongoose validation errors:', validationErrors);
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: validationErrors
        },
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    if (error.code === 11000) {
      console.error('Duplicate key error:', error);
      return NextResponse.json(
        { error: 'Email already subscribed' },
        { 
          status: 409,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Generic error response
    return NextResponse.json(
      { error: 'Failed to subscribe. Please try again later.' },
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
} 