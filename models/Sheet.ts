import mongoose from "mongoose";

const sheetSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    enum: ["Finance", "Marketing", "Customer Relations", "Operations", "Other"],
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  status: {
    type: String,
    enum: ["Active", "Archived"],
    default: "Active",
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt timestamp before saving
sheetSchema.pre("save", function(next) {
  this.updatedAt = new Date();
  next();
});

const Sheet = mongoose.models.Sheet || mongoose.model("Sheet", sheetSchema);

export default Sheet; 