import mongoose from 'mongoose';

// Define the interface for the Newsletter document
export interface INewsletter extends mongoose.Document {
  email: string;
  subscribedAt: Date;
}

const newsletterSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    maxlength: [100, 'Email cannot exceed 100 characters'],
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
  },
  subscribedAt: {
    type: Date,
    default: Date.now,
    immutable: true
  }
});

// Create index for better query performance
newsletterSchema.index({ email: 1 }, { unique: true });
newsletterSchema.index({ subscribedAt: -1 });

// Add pre-save middleware for data sanitization
newsletterSchema.pre('save', function(next) {
  // Sanitize email
  this.email = this.email.trim().toLowerCase();
  next();
});

// Create the model with explicit collection name and type
const Newsletter = (mongoose.models.Newsletter || mongoose.model<INewsletter>('Newsletter', newsletterSchema, 'newsletters')) as mongoose.Model<INewsletter>;

export { Newsletter }; 