import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { NewsletterSubscription } from '@/models/NewsletterSubscription';

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

    // Parse request body
    const body = await request.json();
    console.log('Received request body:', body);
    
    const { email } = body;
    console.log('Extracted email:', email);

    // Validate email
    if (!email?.trim()) {
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
      return NextResponse.json(
        { error: 'Invalid email format' },
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

    // Check if email already exists
    console.log('Checking for existing subscription...');
    const existingSubscription = await NewsletterSubscription.findOne({ email: email.toLowerCase() });
    if (existingSubscription) {
      return NextResponse.json(
        { error: 'Email already subscribed' },
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Create new subscription
    console.log('Creating new subscription...');
    const subscription = await NewsletterSubscription.create({
      email: email.toLowerCase()
    });
    console.log('Subscription created:', subscription);

    return NextResponse.json(
      { message: 'Successfully subscribed to newsletter' },
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Detailed Newsletter subscription error:', error);
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
} 