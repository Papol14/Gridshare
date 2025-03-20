import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Newsletter, INewsletter } from '@/models/Newsletter';

// CORS headers
const headers = {
  'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_APP_URL || '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

// Validate email
function validateEmail(email: string): string | null {
  if (!email?.trim()) return 'Email is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Invalid email format';
  if (email.length > 100) return 'Email is too long';
  return null;
}

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  return NextResponse.json({}, { headers });
}

export async function POST(request: Request) {
  try {
    // Check content type
    const contentType = request.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      return NextResponse.json(
        { error: 'Content-Type must be application/json' },
        { status: 400, headers }
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
        { status: 400, headers }
      );
    }

    console.log('Received newsletter subscription data:', body);

    const { email } = body;

    // Validate email
    const emailValidationError = validateEmail(email);
    if (emailValidationError) {
      console.log('Validation error:', emailValidationError);
      return NextResponse.json(
        { error: emailValidationError },
        { status: 400, headers }
      );
    }

    // Check if email already exists
    console.log('Checking for existing subscription...');
    const existingSubscription = await Newsletter.findOne({ email: email.toLowerCase() });
    if (existingSubscription) {
      console.log('Duplicate subscription found:', existingSubscription.email);
      return NextResponse.json(
        { error: 'Email already subscribed' },
        { status: 400, headers }
      );
    }

    // Create new subscription
    console.log('Creating new newsletter subscription...');
    const subscription = await Newsletter.create({
      email: email.toLowerCase(),
    });

    console.log('Newsletter subscription saved successfully:', {
      id: subscription._id,
      email: subscription.email,
      subscribedAt: subscription.subscribedAt,
    });

    return NextResponse.json(
      { message: 'Successfully subscribed to newsletter' },
      { status: 201, headers }
    );

  } catch (error: any) {
    // Log error details
    console.error('Newsletter subscription error:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      code: error.code,
    });

    // Handle specific MongoDB errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      console.error('Mongoose validation errors:', validationErrors);
      return NextResponse.json(
        { error: 'Validation failed', details: validationErrors },
        { status: 400, headers }
      );
    }

    if (error.code === 11000) {
      console.error('Duplicate key error:', error);
      return NextResponse.json(
        { error: 'Email already subscribed' },
        { status: 409, headers }
      );
    }

    // Generic error response
    return NextResponse.json(
      { error: 'Failed to subscribe. Please try again later.' },
      { status: 500, headers }
    );
  }
}