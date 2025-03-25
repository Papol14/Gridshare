import { config } from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "../lib/mongodb";
import User from "../models/User";
import path from "path";
import fs from "fs";

// Load environment variables from .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
console.log("Looking for .env.local at:", envPath);

if (!fs.existsSync(envPath)) {
  console.error("Error: .env.local file not found at:", envPath);
  process.exit(1);
}

// Read the .env.local file content
const envContent = fs.readFileSync(envPath, 'utf8');
console.log("Found .env.local file with content:", envContent);

const result = config({ path: envPath });
if (result.error) {
  console.error("Error loading .env.local:", result.error);
  process.exit(1);
}

async function createAdminUser() {
  try {
    console.log("Starting admin user creation...");
    console.log("Current working directory:", process.cwd());
    console.log("Environment variables loaded:", {
      MONGODB_URI: process.env.MONGODB_URI ? "Present" : "Missing",
      ADMIN_EMAIL: process.env.ADMIN_EMAIL ? "Present" : "Missing",
      ADMIN_PASSWORD: process.env.ADMIN_PASSWORD ? "Present" : "Missing"
    });
    
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in .env.local");
    }

    if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
      throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be defined in .env.local");
    }

    console.log("Connecting to MongoDB...");
    await connectDB();
    console.log("Connected to MongoDB successfully");

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    // Check if admin user already exists
    console.log("Checking for existing admin user...");
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log("Admin user already exists with email:", adminEmail);
      process.exit(0);
    }

    // Create admin user
    console.log("Creating admin user with email:", adminEmail);
    const adminUser = await User.create({
      name: "Admin",
      email: adminEmail,
      password: adminPassword,
      role: "admin",
      isActive: true,
    });

    console.log("Admin user created successfully:", adminUser.email);
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin user:", error);
    if (error instanceof mongoose.Error) {
      console.error("Mongoose error details:", {
        name: error.name,
        message: error.message,
      });
    }
    process.exit(1);
  } finally {
    try {
      await mongoose.disconnect();
      console.log("Disconnected from MongoDB");
    } catch (error) {
      console.error("Error disconnecting from MongoDB:", error);
    }
  }
}

createAdminUser(); 