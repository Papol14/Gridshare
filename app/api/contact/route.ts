import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Contact } from '@/models/Contact';

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

    // Validate input data
    if (!body.firstName?.trim()) {
      return NextResponse.json(
        { error: 'First name is required' },
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    if (!body.lastName?.trim()) {
      return NextResponse.json(
        { error: 'Last name is required' },
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    if (!body.email?.trim()) {
      return NextResponse.json(
        { error: 'Email is required' },
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    if (!body.subject?.trim()) {
      return NextResponse.json(
        { error: 'Subject is required' },
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    if (!body.message?.trim()) {
      return NextResponse.json(
        { error: 'Message is required' },
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Connect to MongoDB with specific database
    await connectDB('contacts_db');

    // Create new contact submission
    const contact = await Contact.create({
      firstName: body.firstName.trim(),
      lastName: body.lastName.trim(),
      email: body.email.trim(),
      subject: body.subject.trim(),
      message: body.message.trim(),
    });

    return NextResponse.json(
      { message: 'Message saved successfully', id: contact._id },
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
} 