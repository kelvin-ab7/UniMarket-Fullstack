import mongoose from "mongoose";
import dotenv from "dotenv";
import { UserOTPVerification } from "./models/UserOTPVerification.js";

// Load environment variables
dotenv.config({ path: './config.env' });

// Connect to MongoDB
await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/unimarket");

console.log("🔍 Getting latest OTP...");

// Find the most recent OTP record
const otpRecord = await UserOTPVerification.findOne().sort({ createdAt: -1 });

if (otpRecord) {
  console.log("\n" + "=".repeat(60));
  console.log("🔐 LATEST OTP RECORD");
  console.log("=".repeat(60));
  console.log("👤 User ID:", otpRecord.userId);
  console.log("⏰ Expires At:", otpRecord.expiresAt);
  console.log("📅 Created At:", otpRecord.createdAt);
  console.log("=".repeat(60));
  console.log("💡 The OTP code was generated and saved to database.");
  console.log("📧 Check the backend console for the actual OTP code.");
  console.log("🔗 Or check your email: davidawuni0@gmail.com");
  console.log("=".repeat(60));
} else {
  console.log("❌ No OTP records found in database.");
}

await mongoose.disconnect();
