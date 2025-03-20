import nodemailer from 'nodemailer';

// Validate required environment variables
const requiredEnvVars = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'SMTP_FROM', 'SMTP_TO'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error('Missing required environment variables:', missingEnvVars);
  throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
}

// Create reusable transporter with proper type checking
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports like 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: process.env.NODE_ENV === 'production' // Only allow self-signed certificates in development
  }
});

// Verify transporter configuration
const verifyTransporter = async () => {
  try {
    await transporter.verify();
    console.log('SMTP Server is ready to send emails');
  } catch (error) {
    console.error('SMTP Configuration Error:', error);
    throw error;
  }
};

// Initialize transporter verification
verifyTransporter();

// Sanitize HTML content to prevent XSS
const sanitizeHtml = (html: string): string => {
  return html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

// Contact form email template
export async function sendContactEmail(data: {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
}) {
  try {
    // Sanitize input data
    const sanitizedData = {
      firstName: sanitizeHtml(data.firstName),
      lastName: sanitizeHtml(data.lastName),
      email: sanitizeHtml(data.email),
      subject: sanitizeHtml(data.subject),
      message: sanitizeHtml(data.message)
    };

    console.log('Attempting to send contact email...');
    console.log('SMTP Config:', {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      user: process.env.SMTP_USER,
      from: process.env.SMTP_FROM,
      to: process.env.SMTP_TO
    });

    const mailOptions = {
      from: `"Gridshare Contact Form" <${process.env.SMTP_FROM}>`,
      to: process.env.SMTP_TO,
      subject: `New Contact Form Submission: ${sanitizedData.subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${sanitizedData.firstName} ${sanitizedData.lastName}</p>
        <p><strong>Email:</strong> ${sanitizedData.email}</p>
        <p><strong>Subject:</strong> ${sanitizedData.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${sanitizedData.message}</p>
      `,
      text: `
        New Contact Form Submission
        Name: ${sanitizedData.firstName} ${sanitizedData.lastName}
        Email: ${sanitizedData.email}
        Subject: ${sanitizedData.subject}
        Message: ${sanitizedData.message}
      `,
    };

    console.log('Mail options:', {
      ...mailOptions,
      auth: { user: process.env.SMTP_USER }
    });

    const info = await transporter.sendMail(mailOptions);
    console.log('Contact Email Sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending contact email:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to send email' 
    };
  }
}

// Newsletter subscription email template
export async function sendNewsletterSubscription(email: string) {
  try {
    // Sanitize input data
    const sanitizedEmail = sanitizeHtml(email);

    console.log('Attempting to send newsletter subscription email...');
    console.log('SMTP Config:', {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      user: process.env.SMTP_USER,
      from: process.env.SMTP_FROM,
      to: process.env.SMTP_TO
    });

    const mailOptions = {
      from: `"Gridshare Newsletter" <${process.env.SMTP_FROM}>`,
      to: process.env.SMTP_TO,
      subject: 'New Newsletter Subscription',
      html: `
        <h2>New Newsletter Subscription</h2>
        <p>A new user has subscribed to the newsletter:</p>
        <p><strong>Email:</strong> ${sanitizedEmail}</p>
      `,
      text: `
        New Newsletter Subscription
        A new user has subscribed to the newsletter:
        Email: ${sanitizedEmail}
      `,
    };

    console.log('Mail options:', {
      ...mailOptions,
      auth: { user: process.env.SMTP_USER }
    });

    const info = await transporter.sendMail(mailOptions);
    console.log('Newsletter Subscription Email Sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending newsletter subscription email:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to send email' 
    };
  }
} 