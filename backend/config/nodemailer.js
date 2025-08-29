import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: './config.env' });

console.log("🔧 Creating transporter with credentials...");
console.log("📧 GMAIL_USER:", process.env.GMAIL_USER);
console.log("🔑 GMAIL_APP_PASSWORD:", process.env.GMAIL_APP_PASSWORD ? "***SET***" : "NOT SET");

// Use port 465 with SSL for Gmail (working configuration)
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // Use SSL
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  }
});

export default transporter;
