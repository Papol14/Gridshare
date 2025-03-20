import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Contact, IContact } from '@/models/Contact';

// Input validation schema
interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
}

// Validate input data
function validateContactForm(data: Partial<ContactFormData>): string | null {
  if (!data.firstName?.trim()) return 'First name is required';
  if (!data.lastName?.trim()) return 'Last name is required';
  if (!data.email?.trim()) return 'Email is required';
  if (!data.subject?.trim()) return 'Subject is required';
  if (!data.message?.trim()) return 'Message is required';

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) return 'Invalid email format';

  // Validate field lengths
  if (data.firstName.length > 50) return 'First name is too long';
  if (data.lastName.length > 50) return 'Last name is too long';
  if (data.email.length > 100) return 'Email is too long';
  if (data.subject.length > 200) return 'Subject is too long';
  if (data.message.length > 2000) return 'Message is too long';

  return null;
}

export async function POST(request: Request) {
  try {
    // Connect to MongoDB
    console.log('Attempting to connect to MongoDB...');
    await connectDB();
    console.log('Successfully connected to MongoDB');

    // Parse request body
    const body = await request.json();
    console.log('Received contact form data:', body);
    
    const { firstName, lastName, email, subject, message } = body;

    // Validate required fields with specific messages
    const validationErrors: Record<string, string> = {};
    
    if (!firstName?.trim()) {
      validationErrors.firstName = 'First name is required';
    } else if (firstName.length > 50) {
      validationErrors.firstName = 'First name cannot exceed 50 characters';
    } else if (firstName.length < 2) {
      validationErrors.firstName = 'First name must be at least 2 characters long';
    }

    if (!lastName?.trim()) {
      validationErrors.lastName = 'Last name is required';
    } else if (lastName.length > 50) {
      validationErrors.lastName = 'Last name cannot exceed 50 characters';
    } else if (lastName.length < 2) {
      validationErrors.lastName = 'Last name must be at least 2 characters long';
    }

    if (!email?.trim()) {
      validationErrors.email = 'Email is required';
    } else if (email.length > 100) {
      validationErrors.email = 'Email cannot exceed 100 characters';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      validationErrors.email = 'Please enter a valid email address';
    }

    if (!subject?.trim()) {
      validationErrors.subject = 'Subject is required';
    } else if (subject.length > 200) {
      validationErrors.subject = 'Subject cannot exceed 200 characters';
    } else if (subject.length < 5) {
      validationErrors.subject = 'Subject must be at least 5 characters long';
    }

    if (!message?.trim()) {
      validationErrors.message = 'Message is required';
    } else if (message.length > 2000) {
      validationErrors.message = 'Message cannot exceed 2000 characters';
    } else if (message.length < 10) {
      validationErrors.message = 'Message must be at least 10 characters long';
    }

    // If there are validation errors, return them
    if (Object.keys(validationErrors).length > 0) {
      console.log('Validation errors:', validationErrors);
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: validationErrors
        },
        { status: 400 }
      );
    }

    // Create new contact message
    console.log('Creating new contact message...');
    const contact = new Contact({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
      status: 'new'
    });

    // Save to database
    console.log('Saving contact message to database...');
    const savedContact = await contact.save();
    console.log('Contact message saved successfully:', {
      id: savedContact._id,
      email: savedContact.email,
      subject: savedContact.subject,
      fullName: savedContact.fullName
    });

    return NextResponse.json(
      { message: 'Message sent successfully' },
      { status: 201 }
    );

  } catch (error: any) {
    // Log error details
    console.error('Error saving contact message:', error);
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
        { status: 400 }
      );
    }

    if (error.code === 11000) {
      console.error('Duplicate key error:', error);
      return NextResponse.json(
        { error: 'Duplicate entry found' },
        { status: 409 }
      );
    }

    // Generic error response
    return NextResponse.json(
      { error: 'Failed to send message. Please try again later.' },
      { status: 500 }
    );
  }
} 