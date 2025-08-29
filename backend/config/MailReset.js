import { Resend } from 'resend';

const sendOTP = async (email, otp) => {
  try {
    console.log("📧 Setting up Resend API for password reset OTP...");
    console.log("📧 To:", email);
    console.log("🔐 OTP Code:", otp);
    
    // Initialize Resend client
    const resend = new Resend(process.env.RESEND_API_KEY || 're_CNF7wkdy_7pNpHmZShbwNrq8Ly17nDmp8');
    
    const emailData = {
      from: 'UniMarket <onboarding@resend.dev>',
      to: email,
      subject: "UniMarket - Password Reset OTP",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2d3748; margin: 0; font-size: 28px;">UniMarket</h1>
              <p style="color: #718096; margin: 10px 0 0 0; font-size: 16px;">KNUST Student Marketplace</p>
            </div>
            
            <div style="margin-bottom: 30px;">
              <h2 style="color: #2d3748; font-size: 24px; margin-bottom: 15px;">Password Reset</h2>
              <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                You requested a password reset for your UniMarket account. Use the following OTP to reset your password:
              </p>
              
              <div style="background-color: #e53e3e; color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0;">
                <h1 style="font-size: 32px; margin: 0; letter-spacing: 5px; font-weight: bold;">${otp}</h1>
                <p style="margin: 10px 0 0 0; font-size: 14px;">Enter this code to reset your password</p>
              </div>
              
              <p style="color: #e53e3e; font-size: 14px; margin-bottom: 20px;">
                ⚠️ This OTP will expire in 10 minutes for security reasons.
              </p>
            </div>
            
            <div style="background-color: #f7fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #e53e3e;">
              <h3 style="color: #2d3748; margin: 0 0 10px 0; font-size: 18px;">Security Notice</h3>
              <ul style="color: #4a5568; font-size: 14px; line-height: 1.6; margin: 0; padding-left: 20px;">
                <li>If you didn't request this reset, please ignore this email</li>
                <li>Never share your OTP with anyone</li>
                <li>Use a strong, unique password for your account</li>
              </ul>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center;">
              <p style="color: #718096; font-size: 12px; margin: 0;">
                If you didn't request a password reset, please ignore this email.
              </p>
              <p style="color: #718096; font-size: 12px; margin: 10px 0 0 0;">
                © 2024 UniMarket - KNUST Student Marketplace
              </p>
            </div>
          </div>
        </div>
      `,
    };

    const { data, error } = await resend.emails.send(emailData);
    
    if (error) {
      console.error("❌ Resend password reset email error:", error);
      throw error;
    }
    
    console.log("✅ Resend password reset email sent successfully!");
    console.log("📨 Message ID:", data.id);
    console.log("🔐 OTP Code:", otp);
    
  } catch (error) {
    console.error("❌ Error sending password reset email:", error);
    throw error;
  }
};

export default sendOTP;
