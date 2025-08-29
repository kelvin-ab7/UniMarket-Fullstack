import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import { connectDB } from "./config/connectDB.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { generalRateLimiter, authRateLimiter } from "./middleware/rateLimiter.js";
import accountRoutes from "./routes/account.js";
import userInfo from "./routes/info.js";
import message from "./routes/message.route.js";
import category from "./routes/category.route.js";
import adminRoutes from "./routes/admin.js";
import chatbotRoutes from "./routes/chatbot.js";
import MongoStore from "connect-mongo";
import session from "express-session";
// ✅ NEW: Import the searchRoutes
import searchRoutes from "./routes/Sub-Routes/searchRoutes.js";

// Load the environment variables
dotenv.config({ path: path.join(__dirname, 'config.env') });

// Debug: Check if environment variables are loaded
console.log('Environment variables check:');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'SET' : 'NOT SET');
console.log('SESSION_SECRET:', process.env.SESSION_SECRET ? 'SET' : 'NOT SET');
console.log('NODE_ENV:', process.env.NODE_ENV);

const app = express();
const PORT = process.env.PORT || 3005;

// Connecting to the database
connectDB();

// Enable database-dependent routes
const isDatabaseAvailable = true;

// Security middleware with relaxed CSP for development
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP temporarily for testing
}));

// CORS configuration
app.use(
  cors({
    origin: process.env.NODE_ENV === 'production' 
      ? process.env.FRONTEND_URL || "http://localhost:5173"
      : "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Content-Length", "Content-Type"],
  })
);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Rate limiting - temporarily disabled for testing
// app.use(generalRateLimiter);

// Session configuration
const sessionConfig = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
  },
};

// Only add MongoStore if MONGODB_URI is available and database is enabled
if (process.env.MONGODB_URI && isDatabaseAvailable) {
  sessionConfig.store = MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
  });
}

app.use(session(sessionConfig));

// Serve static files with proper headers
app.use("/uploads", express.static(path.join(__dirname, "uploads"), {
  setHeaders: (res, path) => {
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Cache-Control', 'public, max-age=31536000');
  }
}));

app.use("/uploads/student-ids", express.static(path.join(__dirname, "uploads/student-ids"), {
  setHeaders: (res, path) => {
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Cache-Control', 'public, max-age=31536000');
  }
}));

app.get("/", (req, res) => {
  res.send("Hello from the backend!");
});

// Test route for image serving
app.get("/test-image/:filename", (req, res) => {
  const filename = req.params.filename;
  const imagePath = path.join(__dirname, "uploads", filename);
  
  console.log("Testing image access:", {
    filename,
    imagePath,
    exists: require('fs').existsSync(imagePath)
  });
  
  if (require('fs').existsSync(imagePath)) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    res.sendFile(imagePath);
  } else {
    res.status(404).json({ error: "Image not found", filename });
  }
});

// Simple image list endpoint
app.get("/list-images", (req, res) => {
  const fs = require('fs');
  const uploadsPath = path.join(__dirname, "uploads");
  
  try {
    const files = fs.readdirSync(uploadsPath);
    const images = files.filter(file => 
      file.match(/\.(jpg|jpeg|png|gif|webp)$/i)
    );
    res.json({ images, count: images.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Test email OTP endpoint
app.get("/test-email-otp", async (req, res) => {
  try {
    const testEmail = "adawuni2@st.knust.edu.gh"; // Testing with your KNUST email
    const testOTP = Math.floor(100000 + Math.random() * 900000).toString(); // Generate random OTP
    const testUsername = "David Awuni";
    
    console.log("🧪 Testing email OTP sending...");
    console.log("📧 To:", testEmail);
    console.log("🔐 OTP:", testOTP);
    
    const sendOTPEmail = (await import('./config/SendOTPEmail.js')).default;
    await sendOTPEmail(testEmail, testOTP, testUsername);
    
    res.json({ 
      success: true, 
      message: "Test email sent successfully! Check the backend console for the preview URL.",
      email: testEmail,
      otp: testOTP,
      note: "Click the preview URL in the console to see your email"
    });
  } catch (error) {
    console.error("❌ Test email failed:", error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// ✅ Existing API routes - Only mount if database is available
if (isDatabaseAvailable) {
  app.use("/account", accountRoutes);
  app.use("/user", userInfo);
  app.use("/message", message);
  app.use("/category", category);
  app.use("/admin", adminRoutes);
  app.use("/search", searchRoutes);
} else {
  console.log("⚠️ Database not available - only chatbot routes enabled");
}

// Chatbot route - always available
app.use("/chatbot", chatbotRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
