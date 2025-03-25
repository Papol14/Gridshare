import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    unique: true,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  excerpt: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    enum: ["Tutorials", "Tips & Tricks", "Security", "Updates", "Other"],
  },
  status: {
    type: String,
    enum: ["Draft", "Published"],
    default: "Draft",
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  image: {
    type: String,
    trim: true,
  },
  tags: [{
    type: String,
    trim: true,
  }],
  metaTitle: {
    type: String,
    trim: true,
  },
  metaDescription: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  publishedAt: {
    type: Date,
  },
});

// Generate slug from title before saving
blogSchema.pre("save", function(next) {
  if (this.isModified("title")) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
  
  if (this.isModified("status") && this.status === "Published") {
    this.publishedAt = new Date();
  }
  
  this.updatedAt = new Date();
  next();
});

const Blog = mongoose.models.Blog || mongoose.model("Blog", blogSchema);

export default Blog; 