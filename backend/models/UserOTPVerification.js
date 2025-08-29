import mongoose from "mongoose";

const userOTPVerificationSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

export const UserOTPVerification = mongoose.models.UserOTPVerification || mongoose.model("UserOTPVerification", userOTPVerificationSchema);
