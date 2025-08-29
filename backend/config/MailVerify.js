import { Resend } from 'resend';

const sendMail = async (email, link) => {
  try {
    console.log("📧 Setting up Resend API for verification email...");
    console.log("📧 To:", email);
    
    // Initialize Resend client
    const resend = new Resend(process.env.RESEND_API_KEY || 're_CNF7wkdy_7pNpHmZShbwNrq8Ly17nDmp8');
    
             const emailData = {
      from: 'UniMarket <onboarding@resend.dev>',
      to: email,
      subject: "UniMarket - Account Verification Link",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2d3748; margin: 0; font-size: 28px;">UniMarket</h1>
              <p style="color: #718096; margin: 10px 0 0 0; font-size: 16px;">KNUST Student Marketplace</p>
            </div>
            
            <div style="margin-bottom: 30px;">
              <h2 style="color: #2d3748; font-size: 24px; margin-bottom: 15px;">Account Verification</h2>
              <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                Welcome to UniMarket! To complete your account verification, please click the button below:
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${link}" style="background-color: #48bb78; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                  Verify My Account
                </a>
              </div>
              
              <p style="color: #e53e3e; font-size: 14px; margin-bottom: 20px;">
                ⚠️ This verification link will expire in 24 hours for security reasons.
              </p>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center;">
              <p style="color: #718096; font-size: 12px; margin: 0;">
                If you didn't create an account with UniMarket, please ignore this email.
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
      console.error("❌ Resend verification email error:", error);
      throw error;
    }
    
    console.log("✅ Resend verification email sent successfully!");
    console.log("📨 Message ID:", data.id);
    
  } catch (error) {
    console.error("❌ Error sending verification email:", error);
    throw error;
  }
};

export default sendMail;
