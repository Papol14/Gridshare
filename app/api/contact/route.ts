import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Contact, IContact } from '@/models/Contact';

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

    // Connect to MongoDB
    console.log('Attempting to connect to MongoDB...');
    await connectDB();

    const { firstName, lastName, email, subject, message } = body;

    // Validate all fields at once
    const validationErrors: Record<string, string> = {};
    
    // Validation rules
    const rules = {
      firstName: { min: 2, max: 50 },
      lastName: { min: 2, max: 50 },
      email: { max: 100, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
      subject: { min: 5, max: 200 },
      message: { min: 10, max: 2000 }
    };

    // Validate each field
    if (!firstName?.trim()) validationErrors.firstName = 'First name is required';
    else if (firstName.length < rules.firstName.min) validationErrors.firstName = `First name must be at least ${rules.firstName.min} characters`;
    else if (firstName.length > rules.firstName.max) validationErrors.firstName = `First name cannot exceed ${rules.firstName.max} characters`;

    if (!lastName?.trim()) validationErrors.lastName = 'Last name is required';
    else if (lastName.length < rules.lastName.min) validationErrors.lastName = `Last name must be at least ${rules.lastName.min} characters`;
    else if (lastName.length > rules.lastName.max) validationErrors.lastName = `Last name cannot exceed ${rules.lastName.max} characters`;

    if (!email?.trim()) validationErrors.email = 'Email is required';
    else if (!rules.email.pattern.test(email)) validationErrors.email = 'Please enter a valid email address';
    else if (email.length > rules.email.max) validationErrors.email = `Email cannot exceed ${rules.email.max} characters`;

    if (!subject?.trim()) validationErrors.subject = 'Subject is required';
    else if (subject.length < rules.subject.min) validationErrors.subject = `Subject must be at least ${rules.subject.min} characters`;
    else if (subject.length > rules.subject.max) validationErrors.subject = `Subject cannot exceed ${rules.subject.max} characters`;

    if (!message?.trim()) validationErrors.message = 'Message is required';
    else if (message.length < rules.message.min) validationErrors.message = `Message must be at least ${rules.message.min} characters`;
    else if (message.length > rules.message.max) validationErrors.message = `Message cannot exceed ${rules.message.max} characters`;

    if (Object.keys(validationErrors).length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationErrors },
        { status: 400 }
      );
    }

    // Create and save contact
    const contact = new Contact({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
      status: 'new'
    });

    const savedContact = await contact.save();
    console.log('Contact saved:', savedContact._id);

    return NextResponse.json(
      { message: 'Message sent successfully', id: savedContact._id },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('Contact error:', error);

    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to send message. Please try again later.' },
      { status: 500 }
    );
  }
}