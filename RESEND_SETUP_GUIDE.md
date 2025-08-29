# Resend Email Setup Guide for UniMarket

## 🚀 Quick Setup Steps

### 1. **Create Resend Account & API Key**
1. Go to [Resend Dashboard](https://resend.com/dashboard)
2. Sign up/Login
3. Go to **API Keys** section
4. Click **Create API Key**
5. Name: `UniMarket OTP`
6. Permission: **Sending access** (best for OTP)
7. **Copy the API key** (shown only once!)

### 2. **Update Your Environment Variables**
Replace your current API key in `backend/config.env`:
```env
RESEND_API_KEY = your_new_api_key_here
```

### 3. **Domain Verification (Optional but Recommended)**
For production use, verify your domain:
1. Go to **Domains** in Resend dashboard
2. Add your domain (e.g., `unimarket.com`)
3. Add DNS records (SPF, DKIM) provided by Resend
4. Wait for verification
5. Update `from` email to use your domain

### 4. **Test Email Sending**
The system will now work with:
- ✅ **Gmail addresses** (reliable delivery)
- ⚠️ **KNUST emails** (may have delivery issues)
- ✅ **Other emails** (depends on domain verification)

## 🔧 Current Configuration

### Email Sender
- **From**: `UniMarket <onboarding@resend.dev>` (Resend's default)
- **Reply-To**: `support@unimarket.com`

### Supported Email Types
- `@gmail.com` - ✅ Reliable delivery
- `@knust.edu.gh` - ⚠️ May have restrictions
- `@st.knust.edu.gh` - ⚠️ May have restrictions

## 🧪 Testing

### Test with Gmail (Recommended)
```bash
# Test endpoint
curl http://localhost:3005/test-email-otp
```

### Test Registration
1. Use a Gmail address for registration
2. Check email inbox and spam folder
3. Use the OTP to verify account

## 🚨 Troubleshooting

### If emails don't arrive:
1. **Check spam/junk folder**
2. **Verify API key is correct**
3. **Use Gmail address for testing**
4. **Check Resend dashboard for delivery status**

### For KNUST emails:
- KNUST email servers may block external emails
- Use Gmail for registration
- Upload KNUST student ID for verification later

## 📧 Email Template

The system sends professional OTP emails with:
- ✅ UniMarket branding
- ✅ Clear OTP display
- ✅ Security warnings
- ✅ Next steps guide
- ✅ Professional styling

## 🔐 Security Features

- OTP expires in 10 minutes
- Rate limiting on OTP requests
- Secure API key storage
- Email validation
- Development mode fallback

## 🎯 Next Steps

1. **Get your Resend API key**
2. **Update the config.env file**
3. **Test with Gmail address**
4. **Verify email delivery**
5. **Test registration flow**

---

**Need Help?** Check the backend console for detailed error messages and OTP codes during development.
