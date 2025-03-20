import mongoose from 'mongoose';

const newsletterSubscriptionSchema = new mongoose.Schema({
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
export const NewsletterSubscription = mongoose.models.NewsletterSubscription || 
  mongoose.model('NewsletterSubscription', newsletterSubscriptionSchema, 'newsletter_subscriptions'); 