import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Contact, IContact } from '@/models/Contact';

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
}

function validateContactForm(data: Partial<ContactFormData>): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!data.firstName?.trim()) {
    errors.firstName = 'First name is required';
  } else if (data.firstName.length > 50) {
    errors.firstName = 'First name cannot exceed 50 characters';
  }

  if (!data.lastName?.trim()) {
    errors.lastName = 'Last name is required';
  } else if (data.lastName.length > 50) {
    errors.lastName = 'Last name cannot exceed 50 characters';
  }

  if (!data.email?.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!data.subject?.trim()) {
    errors.subject = 'Subject is required';
  } else if (data.subject.length > 200) {
    errors.subject = 'Subject cannot exceed 200 characters';
  }

  if (!data.message?.trim()) {
    errors.message = 'Message is required';
  } else if (data.message.length > 2000) {
    errors.message = 'Message cannot exceed 2000 characters';
  }

  return errors;
}

export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_APP_URL || '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    }
  );
}

export async function POST(request: Request) {
  const headers = {
    'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_APP_URL || '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    console.log('Attempting to connect to MongoDB...');
    await connectDB();
    console.log('Successfully connected to MongoDB');

    const body = await request.json();
    console.log('Received contact form data:', body);

    const validationErrors = validateContactForm(body);
    if (Object.keys(validationErrors).length > 0) {
      console.log('Validation errors:', validationErrors);
      return NextResponse.json(
        { error: 'Validation failed', details: validationErrors },
        { status: 400, headers }
      );
    }

    console.log('Creating new contact message...');
    const contact = new Contact({
      firstName: body.firstName.trim(),
      lastName: body.lastName.trim(),
      email: body.email.trim().toLowerCase(),
      subject: body.subject.trim(),
      message: body.message.trim(),
      status: 'new',
    });

    console.log('Saving contact message to database...');
    const savedContact = await contact.save();
    console.log('Contact message saved successfully:', savedContact);

    return NextResponse.json(
      { message: 'Message sent successfully' },
      { status: 201, headers }
    );

  } catch (error: any) {
    console.error('Error saving contact message:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      code: error.code,
    });

    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { error: 'Validation failed', details: validationErrors },
        { status: 400, headers }
      );
    }

    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Duplicate entry found' },
        { status: 409, headers }
      );
    }

    return NextResponse.json(
      { error: 'Failed to send message. Please try again later.' },
      { status: 500, headers }
    );
  }
}