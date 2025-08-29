// Routes for Register and Verify are defined in this file
import { User } from "../../models/User.js";
import { UserOTPVerification } from "../../models/UserOTPVerification.js";
import bcrypt from "bcrypt";
import transporter from "../../config/nodemailer.js";

export const Register = async (req, res, next) => {
  try {
    const { username, email, password, confirmPassword, phone } = req.body;
    
    // Validate required fields
    if (!username || !email || !password || !confirmPassword || !phone) {
      return res.status(400).json({ msg: "Please fill in all fields" });
    }
    
    // Validate email (KNUST only)
    const emailPattern = /^[a-zA-Z0-9._%+-]+@((st\.)?knust\.edu\.gh)$/;
    if (!emailPattern.test(email)) {
      return res.status(400).json({ 
        msg: "Please use a KNUST email (@knust.edu.gh or @st.knust.edu.gh)" 
      });
    }
    
    if (password !== confirmPassword) {
      return res.status(400).json({ msg: "Passwords do not match" });
    }
    
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      phone,
      verified: false, // User needs to verify email first
    });
    
    await newUser.save();
    
    // Send OTP verification email
    await sendOTPVerificationEmail(email, newUser._id, res);
    
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Send OTP verification email function
const sendOTPVerificationEmail = async (email, userId, res) => {
  try {
    console.log("🚀 Starting email sending process...");
    console.log("📧 Email:", email);
    console.log("👤 User ID:", userId);
    
    // Generate 4-digit OTP (like tutorial)
    const otp = Math.floor(1000 + Math.random() * 9000);
    console.log("🔐 Generated OTP:", otp);
    
    // Email options (matching user's pattern)
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: "UniMarket - Email Verification OTP",
      html: `<h1>UniMarket Email Verification</h1><p>Your verification code is: <strong>${otp}</strong></p><p>This code will expire in 1 hour.</p>`
    };
    
    console.log("📧 Mail options:", mailOptions);
    
    // Hash the OTP
    const saltRounds = 10;
    const hashedOTP = await bcrypt.hash(otp.toString(), saltRounds);
    console.log("🔐 OTP hashed successfully");
    
    // Save OTP to database
    const newOTPVerification = new UserOTPVerification({
      userId: userId,
      otp: hashedOTP,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000) // 1 hour
    });
    
    await newOTPVerification.save();
    console.log("✅ OTP saved to database");
    
    // Send email using user's pattern
    console.log("📡 Attempting to send email...");
    try {
      const response = await transporter.sendMail(mailOptions);
      console.log("✅ Email sent successfully!");
      console.log("📨 Response:", response);
      console.log("🔐 OTP Code:", otp);
      console.log("📧 Sent to:", email);
    } catch (emailError) {
      console.log("❌ Email sending failed!");
      console.log("🔍 Error details:", emailError);
      console.log("📋 Error message:", emailError.message);
      console.log("🔢 Error code:", emailError.code);
      console.log("🔐 OTP Code:", otp);
      console.log("📧 Email:", email);
      console.log("👤 User ID:", userId);
    }
    
    // Always show OTP in console for testing
    console.log("\n" + "=".repeat(60));
    console.log("🔐 OTP FOR TESTING (CONSOLE ONLY)");
    console.log("=".repeat(60));
    console.log("🔐 OTP Code:", otp);
    console.log("📧 Email:", email);
    console.log("👤 User ID:", userId);
    console.log("=".repeat(60));
    
    res.status(200).json({
      status: "pending",
      message: "Verification email sent",
      data: {
        userId: userId,
        email: email
      }
    });
    
  } catch (error) {
    console.log("❌ Registration email function failed!");
    console.log("🔍 Error:", error);
    res.status(500).json({
      status: "failed",
      message: error.message
    });
  }
};

// Verify OTP
export const VerifyOTP = async (req, res) => {
  try {
    const { userId, otp } = req.body;
    
    if (!userId || !otp) {
      throw new Error("User ID and OTP are required");
    }
    
    const userOTPVerificationRecords = await UserOTPVerification.find({ userId });
    
    if (userOTPVerificationRecords.length <= 0) {
      throw new Error("Account record doesn't exist or has been verified already. Please sign up or log in.");
    }
    
    const { expiresAt } = userOTPVerificationRecords[0];
    const hashedOTP = userOTPVerificationRecords[0].otp;
    
    if (expiresAt < new Date()) {
      await UserOTPVerification.deleteMany({ userId });
      throw new Error("Code has expired. Please request again.");
    }
    
    const validOTP = await bcrypt.compare(otp, hashedOTP);
    
    if (!validOTP) {
      throw new Error("Invalid code passed. Check your inbox.");
    }
    
    // Update user verification status
    await User.updateOne({ _id: userId }, { verified: true });
    
    // Delete OTP record
    await UserOTPVerification.deleteMany({ userId });
    
    res.status(200).json({
      status: "verified",
      message: "User email verified successfully"
    });
    
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: error.message
    });
  }
};

// Resend OTP
export const ResendOTP = async (req, res) => {
  try {
    const { userId, email } = req.body;
    
    if (!userId || !email) {
      throw new Error("User ID and email are required");
    }
    
    // Delete all existing OTP records for this user
    await UserOTPVerification.deleteMany({ userId });
    
    // Send new OTP
    await sendOTPVerificationEmail(email, userId, res);
    
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: error.message
    });
  }
};



// Delete user by email (for testing)
export const DeleteUser = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ msg: "Email is required" });
    }
    
    const user = await User.findOneAndDelete({ email });
    
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    
    res.status(200).json({ 
      success: true,
      msg: `User ${email} deleted successfully` 
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
