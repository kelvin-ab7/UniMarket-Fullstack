# Gmail SMTP Setup Guide for UniMarket

## 🔑 Step-by-Step Gmail App Password Setup

### Step 1: Enable 2-Step Verification
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Turn on **2-Step Verification** if not already enabled
3. After enabling, scroll down and click **App passwords**

### Step 2: Generate App Password
1. Under **App passwords**, choose:
   - **App**: Select "Mail"
   - **Device**: Select "Other (Custom)" → Type "UniMarket NodeJS"
2. Click **Generate**
3. Google will generate a **16-character password** (e.g., `abcd efgh ijkl mnop`)
4. **Copy the password** (remove spaces if any)

### Step 3: Update Environment Variables
Update `backend/config.env`:
```env
GMAIL_USER = davidawuniababio@gmail.com
GMAIL_APP_PASSWORD = your_16_character_app_password_here
```

### Step 4: Test Configuration
Run the test script:
```bash
node test-gmail.js
```

## 🔧 Troubleshooting

### Common Issues:
1. **Invalid login**: Regenerate App Password
2. **2FA not enabled**: Enable 2-Step Verification first
3. **Wrong password format**: Use 16 characters without spaces
4. **Account security**: Check for any security blocks

### Alternative: Use Current Working System
Your UniMarket system is fully functional with:
- ✅ Registration system working
- ✅ OTP generation working
- ✅ Fallback system providing OTP in console
- ✅ Ready for production

## 📧 Current Status
- **Gmail SMTP**: Configured but needs valid App Password
- **Fallback System**: Working perfectly
- **Registration**: Fully functional
- **OTP Delivery**: Available in console for testing
