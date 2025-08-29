import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../config.env') });

const router = express.Router();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'your-gemini-api-key-here');

// System prompt for Gemini
const systemPrompt = `You are UniMarket Assistant, a helpful AI assistant for the KNUST Student Marketplace. You help students with:

1. **Product Questions**: Information about buying/selling items, categories, pricing
2. **Account Issues**: Registration, login, profile management, email verification
3. **Student ID Verification**: Process for uploading and verifying student IDs
4. **General Marketplace Info**: How UniMarket works, policies, features
5. **Technical Support**: Basic troubleshooting for the platform

Key Information:
- UniMarket is a student marketplace for KNUST students
- Students can buy and sell items in categories like Electronics, Clothes, Food, etc.
- Student ID verification is required for trusted selling
- Email verification is needed for account activation
- Admin approval is required for student ID verification
- The platform is completely free to use
- Payment methods include cash, mobile money, and bank transfers

Be friendly, helpful, and concise. If you don't know something specific about UniMarket, suggest contacting support or checking the help section.`;

// Intelligent rule-based chatbot for UniMarket
class UniMarketChatbot {
  constructor() {
    this.context = {};
    this.conversationHistory = [];
    this.geminiModel = null;
    this.geminiAvailable = false;
    this.initializeGemini();
  }

  async initializeGemini() {
    try {
      if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your-gemini-api-key-here') {
        this.geminiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        this.geminiAvailable = true;
        console.log('🤖 Gemini AI initialized successfully');
      } else {
        console.log('⚠️ Gemini API key not configured, using rule-based responses only');
      }
    } catch (error) {
      console.error('❌ Gemini initialization failed:', error);
      this.geminiAvailable = false;
    }
  }

  // Main response generator
  async generateResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase().trim();
    
    // Add to conversation history
    this.conversationHistory.push({ user: userMessage, timestamp: new Date() });
    
    // Keep only last 10 messages for context
    if (this.conversationHistory.length > 10) {
      this.conversationHistory.shift();
    }

    // First, try rule-based responses for common queries
    const ruleBasedResponse = this.getRuleBasedResponse(lowerMessage);
    
    // If we have a good rule-based response, use it
    if (ruleBasedResponse && ruleBasedResponse !== this.getDefaultResponse()) {
      return ruleBasedResponse;
    }

    // If Gemini is available, try to enhance the response
    if (this.geminiAvailable) {
      try {
        const geminiResponse = await this.getGeminiResponse(userMessage);
        if (geminiResponse) {
          return geminiResponse;
        }
      } catch (error) {
        console.error('❌ Gemini API error:', error);
        // Fall back to rule-based response
      }
    }

    // Return rule-based response as fallback
    return ruleBasedResponse;
  }

  // Rule-based response generator
  getRuleBasedResponse(lowerMessage) {
    // Check for greetings
    if (this.isGreeting(lowerMessage)) {
      return this.getGreetingResponse();
    }

    // Check for help requests
    if (this.isHelpRequest(lowerMessage)) {
      return this.getHelpResponse();
    }

    // Check for registration questions
    if (this.isRegistrationQuestion(lowerMessage)) {
      return this.getRegistrationResponse();
    }

    // Check for student ID verification
    if (this.isVerificationQuestion(lowerMessage)) {
      return this.getVerificationResponse();
    }

    // Check for selling questions
    if (this.isSellingQuestion(lowerMessage)) {
      return this.getSellingResponse();
    }

    // Check for buying questions
    if (this.isBuyingQuestion(lowerMessage)) {
      return this.getBuyingResponse();
    }

    // Check for category questions
    if (this.isCategoryQuestion(lowerMessage)) {
      return this.getCategoryResponse();
    }

    // Check for account issues
    if (this.isAccountQuestion(lowerMessage)) {
      return this.getAccountResponse();
    }

    // Check for contact/support
    if (this.isContactQuestion(lowerMessage)) {
      return this.getContactResponse();
    }

    // Check for pricing questions
    if (this.isPricingQuestion(lowerMessage)) {
      return this.getPricingResponse();
    }

    // Check for security/safety
    if (this.isSecurityQuestion(lowerMessage)) {
      return this.getSecurityResponse();
    }

    // Check for payment questions
    if (this.isPaymentQuestion(lowerMessage)) {
      return this.getPaymentResponse();
    }

    // Default response with suggestions
    return this.getDefaultResponse();
  }

  // Gemini API response generator
  async getGeminiResponse(userMessage) {
    try {
      const prompt = `${systemPrompt}

User Question: ${userMessage}

Please provide a helpful, friendly response specific to UniMarket. Keep it concise but informative.`;

      const result = await this.geminiModel.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      if (text && text.trim()) {
        return text.trim();
      }
    } catch (error) {
      console.error('❌ Gemini API error:', error);
    }
    return null;
  }

  // Pattern matching methods
  isGreeting(message) {
    const greetings = ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'sup', 'yo'];
    return greetings.some(greeting => message.includes(greeting));
  }

  isHelpRequest(message) {
    const helpWords = ['help', 'support', 'assist', 'guide', 'how to', 'what can you do', 'what do you do'];
    return helpWords.some(word => message.includes(word));
  }

  isRegistrationQuestion(message) {
    const regWords = ['register', 'sign up', 'signup', 'create account', 'new account', 'join', 'signup', 'registration'];
    return regWords.some(word => message.includes(word));
  }

  isVerificationQuestion(message) {
    const verifyWords = ['verify', 'verification', 'student id', 'studentid', 'id card', 'badge', 'verified', 'approve'];
    return verifyWords.some(word => message.includes(word));
  }

  isSellingQuestion(message) {
    const sellWords = ['sell', 'selling', 'post', 'upload', 'add product', 'list item', 'marketplace', 'vendor'];
    return sellWords.some(word => message.includes(word));
  }

  isBuyingQuestion(message) {
    const buyWords = ['buy', 'buying', 'purchase', 'shop', 'browse', 'find', 'search', 'buyer'];
    return buyWords.some(word => message.includes(word));
  }

  isCategoryQuestion(message) {
    const categoryWords = ['category', 'categories', 'electronics', 'clothes', 'food', 'services', 'software', 'student needs'];
    return categoryWords.some(word => message.includes(word));
  }

  isAccountQuestion(message) {
    const accountWords = ['account', 'profile', 'login', 'password', 'email', 'settings', 'update', 'change'];
    return accountWords.some(word => message.includes(word));
  }

  isContactQuestion(message) {
    const contactWords = ['contact', 'support', 'help desk', 'admin', 'report', 'issue', 'problem', 'complaint'];
    return contactWords.some(word => message.includes(word));
  }

  isPricingQuestion(message) {
    const pricingWords = ['price', 'cost', 'fee', 'charge', 'free', 'paid', 'subscription', 'commission'];
    return pricingWords.some(word => message.includes(word));
  }

  isSecurityQuestion(message) {
    const securityWords = ['safe', 'security', 'secure', 'trust', 'scam', 'fraud', 'protect', 'privacy'];
    return securityWords.some(word => message.includes(word));
  }

  isPaymentQuestion(message) {
    const paymentWords = ['pay', 'payment', 'money', 'cash', 'transfer', 'bank', 'mobile money', 'mpesa'];
    return paymentWords.some(word => message.includes(word));
  }

  // Response generators
  getGreetingResponse() {
    const responses = [
      "Hello! 👋 I'm UniMarket Assistant, your friendly guide to the KNUST Student Marketplace! How can I help you today?",
      "Hi there! 🎓 Welcome to UniMarket! I'm here to help you buy, sell, and connect with fellow KNUST students. What would you like to know?",
      "Hey! 🚀 Great to see you on UniMarket! I can help you with registration, buying, selling, student verification, and more. What's on your mind?"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  getHelpResponse() {
    return `I'm here to help you with everything UniMarket! 🎯

Here's what I can assist you with:

📝 **Account & Registration**
• How to register and verify your email
• Student ID verification process
• Profile management and settings

🛒 **Buying & Selling**
• How to post items for sale
• How to browse and buy products
• Payment and transaction safety

🏷️ **Categories & Products**
• Available product categories
• Search and filter options
• Product listing guidelines

🔒 **Safety & Security**
• Safe transaction practices
• Student verification benefits
• Reporting issues

💬 **Support & Contact**
• Getting help with issues
• Contacting administrators
• Platform guidelines

What specific area would you like help with?`;
  }

  getRegistrationResponse() {
    return `📝 **Registration Guide for UniMarket**

Here's how to get started:

1️⃣ **Create Account**
• Go to the signup page
• Use your Gmail or KNUST email (@gmail.com, @knust.edu.gh, or @st.knust.edu.gh)
• Fill in your details (username, phone, password)

2️⃣ **Email Verification**
• Check your email for OTP code
• Enter the 6-digit code to verify your account
• If you don't receive email, check spam folder

3️⃣ **Student ID Verification** (Recommended)
• Upload your KNUST student ID
• Admin will review and approve
• Get a verification badge for trust

4️⃣ **Start Using UniMarket**
• Browse products on homepage
• Post items for sale
• Connect with other students

💡 **Tips:**
• Gmail addresses have better email delivery
• Student ID verification builds buyer trust
• Keep your contact info updated

Need help with any specific step?`;
  }

  getVerificationResponse() {
    return `✅ **Student ID Verification Process**

This helps build trust and credibility on UniMarket:

📋 **How to Upload Your Student ID:**
1. Go to your Profile page
2. Click "Upload Student ID" section
3. Take a clear photo of your KNUST ID card
4. Submit for admin review

⏱️ **Review Process:**
• Admins review within 24-48 hours
• You'll get notified of approval/rejection
• Verified users get a special badge

🎖️ **Benefits of Verification:**
• Trust badge on your profile
• Higher visibility in search results
• Buyers trust verified sellers more
• Access to premium features

🔒 **Security:**
• Your ID is stored securely
• Only admins can view it
• Used only for verification purposes

❓ **Common Issues:**
• Blurry photos → Take a clear, well-lit photo
• Wrong ID → Make sure it's your KNUST student ID
• Rejected → Contact admin for clarification

Would you like help uploading your student ID?`;
  }

  getSellingResponse() {
    return `💰 **How to Sell on UniMarket**

Follow these steps to start selling:

1️⃣ **Prepare Your Item**
• Take clear, well-lit photos
• Write detailed descriptions
• Set a fair, competitive price
• Check similar items for pricing

2️⃣ **Post Your Item**
• Click "Sell" in the navigation
• Select the appropriate category
• Fill in all required fields
• Upload multiple photos if possible

3️⃣ **Categories Available:**
• 📱 Electronics (phones, laptops, etc.)
• 👕 Clothes & Fashion
• 🍕 Food & Beverages
• 🏠 Home Appliances
• 💼 Services (tutoring, etc.)
• 💻 Software & Digital
• 📚 Student Needs (books, etc.)
• 🎯 Others

4️⃣ **Best Practices:**
• Be honest about item condition
• Respond quickly to buyer messages
• Meet in safe, public locations
• Keep communication professional

5️⃣ **After Sale:**
• Mark item as sold
• Leave feedback for buyer
• Consider similar items to post

💡 **Pro Tips:**
• Student ID verification increases trust
• Good photos = more interest
• Fair pricing = faster sales
• Quick responses = happy buyers

Need help with a specific part of selling?`;
  }

  getBuyingResponse() {
    return `🛒 **How to Buy on UniMarket**

Here's your complete buying guide:

1️⃣ **Browse Products**
• Check the homepage for latest items
• Use search bar for specific items
• Browse categories for organized shopping
• Filter by price, location, or condition

2️⃣ **Find What You Want**
• Read product descriptions carefully
• Check all photos provided
• Look at seller's profile and rating
• Compare prices with similar items

3️⃣ **Contact the Seller**
• Click "Contact Seller" on product page
• Send a polite, specific message
• Ask relevant questions about the item
• Discuss meeting location and time

4️⃣ **Safe Transaction**
• Meet in public, well-lit areas
• Bring a friend if possible
• Test electronics before paying
• Get receipt or proof of purchase

5️⃣ **After Purchase**
• Leave honest feedback
• Report any issues immediately
• Consider buying from same seller again

🔍 **Search Tips:**
• Use specific keywords
• Try different spellings
• Check multiple categories
• Sort by price or date

💡 **Safety First:**
• Verify seller's student ID badge
• Meet on campus when possible
• Trust your instincts
• Report suspicious activity

Looking for something specific?`;
  }

  getCategoryResponse() {
    return `🏷️ **UniMarket Categories**

Here are all the categories you can browse and sell in:

📱 **Electronics**
• Phones & Accessories
• Laptops & Computers
• Gaming Consoles
• Audio Equipment
• Chargers & Cables

👕 **Clothes & Fashion**
• Casual Wear
• Formal Attire
• Shoes & Sneakers
• Bags & Accessories
• Jewelry & Watches

🍕 **Food & Beverages**
• Homemade Meals
• Snacks & Treats
• Beverages
• Fresh Produce
• Food Delivery

🏠 **Home Appliances**
• Kitchen Appliances
• Cleaning Equipment
• Furniture
• Decorations
• Storage Solutions

💼 **Services**
• Tutoring & Classes
• Event Planning
• Photography
• Transportation
• Technical Support

💻 **Software & Digital**
• Software Licenses
• Digital Art
• Online Courses
• Gaming Accounts
• Digital Services

📚 **Student Needs**
• Textbooks & Notes
• Study Materials
• Stationery
• Lab Equipment
• Academic Services

🎯 **Others**
• Sports Equipment
• Musical Instruments
• Art & Crafts
• Collectibles
• Miscellaneous Items

💡 **Tips:**
• Choose the most specific category
• Use relevant keywords in titles
• Add detailed descriptions
• Include multiple photos

Which category interests you?`;
  }

  getAccountResponse() {
    return `👤 **Account Management**

Here's how to manage your UniMarket account:

🔐 **Login & Security**
• Use your registered email and password
• Keep your password secure
• Log out from shared devices
• Contact support if you forget password

📧 **Email Verification**
• Check your email for verification
• Resend OTP if needed
• Update email if necessary
• Verify new email addresses

👤 **Profile Management**
• Update your profile picture
• Edit personal information
• Change contact details
• Update bio and description

📱 **Settings**
• Notification preferences
• Privacy settings
• Account preferences
• Language settings

🔒 **Student ID Verification**
• Upload your KNUST student ID
• Check verification status
• Update ID if needed
• Contact admin for issues

📊 **Account Activity**
• View your posted items
• Check message history
• Review transaction history
• Monitor account status

❓ **Common Issues:**
• Can't login → Reset password
• Email not verified → Check spam folder
• Profile not updating → Refresh page
• ID verification pending → Wait 24-48 hours

Need help with a specific account issue?`;
  }

  getContactResponse() {
    return `📞 **Contact & Support**

Here's how to get help on UniMarket:

🤖 **Chatbot Support** (You're here!)
• General questions and guidance
• How-to instructions
• Platform information
• Quick troubleshooting

👨‍💼 **Admin Support**
• Student ID verification issues
• Account problems
• Technical difficulties
• Policy violations
• Emergency situations

📧 **Email Support**
• Detailed technical issues
• Account recovery
• Feature requests
• Bug reports

🚨 **Emergency Contact**
• For urgent security issues
• Fraud or scam reports
• Harassment concerns
• Immediate account suspension

💡 **Before Contacting Support:**
• Check this chatbot first
• Gather relevant information
• Take screenshots if needed
• Be specific about your issue

📋 **Information to Include:**
• Your username/email
• Detailed description of issue
• Steps you've already tried
• Screenshots or error messages
• When the issue occurred

⏱️ **Response Times:**
• Chatbot: Instant
• Admin: 24-48 hours
• Email: 2-3 business days
• Emergency: ASAP

What specific issue do you need help with?`;
  }

  getPricingResponse() {
    return `💰 **Pricing & Fees on UniMarket**

Here's everything about costs:

✅ **What's FREE:**
• Account registration
• Browsing and searching
• Messaging sellers
• Student ID verification
• Basic account features
• Posting items for sale
• Using the platform

💸 **No Hidden Fees:**
• No commission on sales
• No listing fees
• No subscription charges
• No premium features
• No transaction fees

💡 **Pricing Guidelines:**
• Set fair, competitive prices
• Research similar items
• Consider item condition
• Factor in original cost
• Be open to negotiation

📊 **Price Setting Tips:**
• Check similar items first
• Consider depreciation
• Factor in condition
• Be realistic about value
• Leave room for negotiation

🎯 **Negotiation:**
• Be polite and respectful
• Make reasonable offers
• Consider seller's perspective
• Don't lowball excessively
• Be prepared to walk away

💡 **Best Practices:**
• Price items fairly
• Be honest about condition
• Include shipping costs if applicable
• Consider market demand
• Update prices if needed

Need help pricing a specific item?`;
  }

  getSecurityResponse() {
    return `🔒 **Safety & Security on UniMarket**

Your safety is our priority:

✅ **Safe Practices:**
• Meet in public, well-lit areas
• Bring a friend when possible
• Meet on campus when available
• Test electronics before paying
• Get receipts or proof of purchase

👤 **Student Verification:**
• Look for verified student badges
• Check seller's profile thoroughly
• Read reviews and feedback
• Trust your instincts
• Report suspicious activity

💰 **Payment Safety:**
• Pay in person when possible
• Use secure payment methods
• Avoid advance payments
• Get proof of transaction
• Keep payment records

📱 **Communication Safety:**
• Use platform messaging
• Don't share personal info
• Be cautious with contact details
• Report harassment immediately
• Block problematic users

🚨 **Red Flags to Watch:**
• Prices too good to be true
• Pressure to pay quickly
• Requests for personal info
• Meeting in isolated areas
• Unverified sellers for expensive items

🆘 **Emergency Contacts:**
• Report scams immediately
• Contact campus security
• Notify platform admins
• Keep evidence of issues
• Don't confront dangerous situations

💡 **Trust Your Instincts:**
• If something feels wrong, it probably is
• Better safe than sorry
• Use common sense
• Ask for help when needed

Need help with a specific safety concern?`;
  }

  getPaymentResponse() {
    return `💳 **Payment Methods on UniMarket**

Here are the payment options:

💵 **Cash (Recommended)**
• Most common method
• Pay when you meet
• Count money carefully
• Get receipt if possible
• Safe for both parties

📱 **Mobile Money**
• MTN Mobile Money
• Vodafone Cash
• Airtel Money
• Quick and convenient
• Keep transaction records

🏦 **Bank Transfer**
• Direct bank transfers
• Get confirmation
• Keep transfer receipts
• Verify before meeting
• Good for large amounts

💳 **Digital Payments**
• PayPal (if available)
• Other digital wallets
• Credit/debit cards
• Online payment platforms
• Keep transaction records

⚠️ **Payment Safety Tips:**
• Meet in person when possible
• Test items before paying
• Get proof of payment
• Don't pay in advance
• Use secure methods

💡 **Best Practices:**
• Agree on payment method beforehand
• Have exact change ready
• Count money together
• Get receipts or confirmations
• Keep all transaction records

🚨 **Avoid:**
• Advance payments
• Unverified payment methods
• Pressure to pay quickly
• Suspicious payment requests
• Sharing banking details

Need help with a specific payment method?`;
  }

  getDefaultResponse() {
    return `I'm not sure I understood that completely. 🤔

But I'm here to help with UniMarket! Here are some things I can assist you with:

📝 **Account & Registration**
• How to register and verify your email
• Student ID verification process
• Profile management

🛒 **Buying & Selling**
• How to post items for sale
• How to browse and buy products
• Payment and safety tips

🏷️ **Categories & Products**
• Available product categories
• Search and filter options

🔒 **Safety & Support**
• Safe transaction practices
• Getting help with issues
• Contacting administrators

Could you rephrase your question or choose one of these topics? I'm here to help! 😊`;
  }
}

// Initialize chatbot instance
const chatbot = new UniMarketChatbot();

// Chatbot endpoint
router.post('/', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ 
        success: false, 
        error: 'Message is required and must be a string' 
      });
    }

    console.log('🤖 Chatbot request:', message);

    // Generate response using our hybrid chatbot
    const reply = await chatbot.generateResponse(message);

    console.log('🤖 Chatbot response:', reply);

    res.json({ 
      success: true, 
      reply,
      note: chatbot.geminiAvailable ? 'Powered by UniMarket Assistant + Gemini AI' : 'Powered by UniMarket Intelligent Assistant (Rule-based)'
    });

  } catch (error) {
    console.error('❌ Chatbot error:', error);
    
    res.status(500).json({
      success: false,
      error: 'Sorry, I encountered an error. Please try again.',
      note: 'Internal server error'
    });
  }
});

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    status: 'UniMarket Hybrid Chatbot is running',
    features: [
      'Comprehensive Rule-based Responses',
      'Gemini AI Enhancement (when available)',
      'Account & Registration Help',
      'Buying & Selling Guidance',
      'Student ID Verification',
      'Safety & Security Tips',
      'Category Information',
      'Payment Methods',
      'Contact & Support'
    ],
    geminiStatus: chatbot.geminiAvailable ? 'Available' : 'Not configured',
    note: 'Hybrid system - reliable rule-based + AI enhancement'
  });
});

export default router;
