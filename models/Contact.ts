import mongoose from 'mongoose';

// Define the interface for the Contact document
export interface IContact extends mongoose.Document {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
  createdAt: Date;
  status: 'new' | 'read' | 'replied' | 'archived';
  fullName: string;
}

const contactSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters'],
    minlength: [2, 'First name must be at least 2 characters long']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters'],
    minlength: [2, 'Last name must be at least 2 characters long']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    maxlength: [100, 'Email cannot exceed 100 characters'],
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address']
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true,
    maxlength: [200, 'Subject cannot exceed 200 characters'],
    minlength: [5, 'Subject must be at least 5 characters long']
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    maxlength: [2000, 'Message cannot exceed 2000 characters'],
    minlength: [10, 'Message must be at least 10 characters long']
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true
  },
  status: {
    type: String,
    enum: ['new', 'read', 'replied', 'archived'],
    default: 'new'
  }
}, {
  timestamps: true
});

// Create indexes for better query performance
contactSchema.index({ email: 1 });
contactSchema.index({ createdAt: -1 });
contactSchema.index({ status: 1 });

// Add virtual for full name
contactSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Configure virtuals
contactSchema.set('toJSON', { virtuals: true });
contactSchema.set('toObject', { virtuals: true });

// Add pre-save middleware for data sanitization
contactSchema.pre('save', function(next) {
  // Sanitize strings
  this.firstName = this.firstName.trim();
  this.lastName = this.lastName.trim();
  this.email = this.email.trim().toLowerCase();
  this.subject = this.subject.trim();
  this.message = this.message.trim();
  next();
});

// Create the model with explicit collection name and type
const Contact = (mongoose.models.Contact || mongoose.model<IContact>('Contact', contactSchema, 'contact_messages')) as mongoose.Model<IContact>;

export { Contact }; 