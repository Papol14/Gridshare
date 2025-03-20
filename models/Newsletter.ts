import mongoose from 'mongoose';

const newsletterSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    maxlength: 100
  },
  subscribedAt: {
    type: Date,
    default: Date.now
  }
});

// Create the model with explicit collection name
export const Newsletter = mongoose.models.Newsletter || mongoose.model('Newsletter', newsletterSchema, 'newsletters'); 