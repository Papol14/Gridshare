import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Contact } from '@/models/Contact';

export async function POST(request: Request) {
  try {
    // Connect to MongoDB first
    await connectDB();

    // Validate content type
    const contentType = request.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      return NextResponse.json(
        { error: 'Content-Type must be application/json' },
        { status: 400 }
      );
    }

    // Parse request body safely
    let body;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const { firstName, lastName, email, subject, message } = body;

    // Validate required fields
    if (!firstName?.trim() || !lastName?.trim() || !email?.trim() || 
        !subject?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Create contact
    const contact = await Contact.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      subject: subject.trim(),
      message: message.trim(),
      status: 'new'
    });

    return NextResponse.json(
      { message: 'Message sent successfully' },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('Contact form error:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });

    return NextResponse.json(
      { error: 'Failed to send message. Please try again later.' },
      { status: 500 }
    );
  }
}