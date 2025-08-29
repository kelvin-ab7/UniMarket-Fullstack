import mongoose from "mongoose";
import dotenv from "dotenv";
import { UserOTPVerification } from "./models/UserOTPVerification.js";

// Load environment variables
dotenv.config({ path: './config.env' });

// Connect to MongoDB
await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/unimarket");

console.log("🔍 Checking for OTP records...");

// Find the latest OTP for the user
const userId = "68b1b4d97d25cae46487fa64"; // From the last registration
const otpRecord = await UserOTPVerification.findOne({ userId }).sort({ createdAt: -1 });

if (otpRecord) {
  console.log("\n" + "=".repeat(50));
  console.log("🔐 OTP RECORD FOUND!");
  console.log("=".repeat(50));
  console.log("👤 User ID:", otpRecord.userId);
  console.log("🔐 Hashed OTP:", otpRecord.otp);
  console.log("⏰ Expires At:", otpRecord.expiresAt);
  console.log("📅 Created At:", otpRecord.createdAt);
  console.log("=".repeat(50));
  console.log("💡 The OTP is hashed for security.");
  console.log("📧 Check your email or backend console for the actual OTP code.");
  console.log("=".repeat(50));
} else {
  console.log("❌ No OTP record found for user:", userId);
}

await mongoose.disconnect();
