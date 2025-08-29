# UniMarket - University Student Marketplace

A fullstack marketplace application designed specifically for university students to buy and sell items on campus.

## 🚀 Features

- **User Authentication**: Secure login/signup with email verification
- **Product Management**: List, edit, and delete products with image uploads
- **Category-based Browsing**: Organized product categories (Electronics, Clothes, Food, etc.)
- **Search & Filter**: Advanced search functionality with multiple filters
- **Real-time Messaging**: Chat system for buyers and sellers
- **User Profiles**: Detailed user profiles with product history
- **Responsive Design**: Mobile-first design with modern UI

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite
- **Tailwind CSS** for styling
- **Material-UI** components
- **React Router** for navigation
- **Axios** for API calls
- **FontAwesome** icons

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** authentication
- **Multer** for file uploads
- **Nodemailer** for email services
- **Socket.io** for real-time features

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone <repository-url>
cd UniMarket-Fullstack
```

### 2. Backend Setup
```bash
cd backend
npm install
```

### 3. Environment Configuration
Create a `.env` file in the backend directory:
```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/unimarket

# Session Configuration
SESSION_SECRET=your-super-secret-session-key-change-this-in-production

# Email Configuration (for password reset and verification)
GMAIL_USER=your-email@gmail.com
PASSWORD=your-app-password

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server Configuration
PORT=3005
NODE_ENV=development
```

### 4. Frontend Setup
```bash
cd frontend
npm install
```

### 5. Start the Application

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3005

## 📁 Project Structure

```
UniMarket-Fullstack/
├── backend/
│   ├── config/          # Database and email configuration
│   ├── middleware/      # Authentication and error handling
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── uploads/         # File uploads
│   └── index.js         # Main server file
├── frontend/
│   ├── src/
│   │   ├── Components/  # Reusable components
│   │   ├── Pages/       # Page components
│   │   ├── config/      # API configuration
│   │   └── App.jsx      # Main app component
│   └── package.json
└── README.md
```

## 🔧 Configuration

### Email Setup
For email functionality (password reset, verification), you'll need:
1. A Gmail account
2. App password (not regular password)
3. Enable 2-factor authentication on your Gmail account

### Database Setup
- Local MongoDB: Install MongoDB locally
- Cloud MongoDB: Use MongoDB Atlas or similar service

## 🚀 Deployment

### Backend Deployment
1. Set up environment variables for production
2. Deploy to platforms like Heroku, Vercel, or Railway
3. Update CORS settings with your frontend URL

### Frontend Deployment
1. Update API configuration in `src/config/api.js`
2. Build the project: `npm run build`
3. Deploy to platforms like Vercel, Netlify, or GitHub Pages

## 🔒 Security Features

- JWT token authentication
- Rate limiting on API endpoints
- Input validation and sanitization
- Secure file upload handling
- CORS protection
- Helmet security headers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:
1. Check the console for error messages
2. Verify all environment variables are set
3. Ensure MongoDB is running
4. Check network connectivity

## 🔄 Recent Updates

- ✅ Centralized API configuration
- ✅ Enhanced error handling
- ✅ Rate limiting implementation
- ✅ Security improvements
- ✅ Linting fixes
- ✅ Environment configuration 
