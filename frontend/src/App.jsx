// import { Navigate, Routes, Route, redirect } from "react-router-dom";
import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./Pages/Home";
import Search from "./Pages/Search";
// Account Routes
import Login from "./Pages/Account/Login";
import SignUp from "./Pages/Account/Signup";
import ForgotPassword from "./Pages/Account/ForgotPassword";
import VerifyOTP from "./Pages/Account/VerifyOTP";
import ResetPassword from "./Pages/Account/ResetPassword";
import EmailVerification from "./Pages/EmailVerification";
// Admin Routes
import VerificationDashboard from "./Pages/Admin/VerificationDashboard";
import AdminDashboard from "./Pages/Admin/AdminDashboard";
// Products Routes
import Sell from "./Pages/Sell";
import ShowProduct from "./Pages/ShowProduct";
import ViewSeller from "./Pages/ViewSeller";
// User Routes
import Profile from "./Pages/Profile/Profile";
import EditProfile from "./Pages/Profile/EditProfile";
import ViewProduct from "./Pages/Profile/ViewProduct";
import EditProduct from "./Pages/Profile/EditProduct";
// Messages Routes
import Message from "./Pages/Messages/Message";
import Chat from "./Pages/Messages/Chat";
// Categories Rouets
import Clothes from "./Pages/Categories/Clothes";
import Food from "./Pages/Categories/Food";
import Electronics from "./Pages/Categories/Electronics";
import HomeAppliances from "./Pages/Categories/HomeAppliances";
import Services from "./Pages/Categories/Services";
import Software from "./Pages/Categories/Software";
import StudentNeeds from "./Pages/Categories/StudentNeeds";
import Others from "./Pages/Categories/Others";

import { useAuthContext } from "./Components/authContext";
import ProtectedRoute from "./Components/ProtectedRoute";
import AdminProtectedRoute from "./Components/AdminProtectedRoute";
import RedirectIfAuthenticated from "./Components/RedirectIfAuthenticated";
import Nav from "./Components/NavBar";
import Chatbot from "./Components/Chatbot";
import { useLocation } from "react-router-dom";
import "./App.css";

export default function App() {
  const { auth } = useAuthContext();
  const location = useLocation();
  
  console.log("App rendering - auth:", auth, "location:", location.pathname);
  
  // Don't show NavBar on login and signup pages
  const showNavBar = auth && !['/login', '/signup', '/forgot-password', '/verify-otp', '/reset-password', '/verify-email'].includes(location.pathname);

  useEffect(() => {
    const interval = setInterval(() => {
      window.location.reload();
    }, 3600000); // 1 hour in milliseconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  return (
    <>
      {showNavBar && <Nav />}
      <Chatbot />
      <Routes>
        {/* Default route - redirect based on authentication status */}
        <Route 
          path="/" 
          element={
            auth ? (
              auth.role === 'admin' ? (
                <Navigate to="/admin/dashboard" replace />
              ) : (
                <Navigate to="/home" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        
        {/* Public routes - accessible without authentication */}
        <Route path="/login" element={<RedirectIfAuthenticated><Login /></RedirectIfAuthenticated>} />
        <Route path="/signup" element={<RedirectIfAuthenticated><SignUp /></RedirectIfAuthenticated>} />
        <Route path="/verify-email" element={<EmailVerification />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
        {/* Protected routes - require authentication */}
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
        <Route path="/sell" element={<ProtectedRoute><Sell /></ProtectedRoute>} />
        <Route path="/product/:id" element={<ProtectedRoute><ShowProduct /></ProtectedRoute>} />
        <Route path="/seller/:id" element={<ProtectedRoute><ViewSeller /></ProtectedRoute>} />
        
        {/* User Routes */}
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/edit-profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
        <Route path="/view-items/:id" element={<ProtectedRoute><ViewProduct /></ProtectedRoute>} />
        <Route path="/edit-items/:id" element={<ProtectedRoute><EditProduct /></ProtectedRoute>} />
        
        {/* Messages Routes */}
        <Route path="/messages" element={<ProtectedRoute><Message /></ProtectedRoute>} />
        <Route path="/chat/:id" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
        
        {/* Categories Routes - accessible to authenticated users */}
        <Route path="/clothes" element={<ProtectedRoute><Clothes /></ProtectedRoute>} />
        <Route path="/food" element={<ProtectedRoute><Food /></ProtectedRoute>} />
        <Route path="/electronics" element={<ProtectedRoute><Electronics /></ProtectedRoute>} />
        <Route path="/home-appliances" element={<ProtectedRoute><HomeAppliances /></ProtectedRoute>} />
        <Route path="/services" element={<ProtectedRoute><Services /></ProtectedRoute>} />
        <Route path="/software" element={<ProtectedRoute><Software /></ProtectedRoute>} />
        <Route path="/Student-needs" element={<ProtectedRoute><StudentNeeds /></ProtectedRoute>} />
        <Route path="/others" element={<ProtectedRoute><Others /></ProtectedRoute>} />
        
        {/* Admin Routes */}
        <Route path="/admin/verifications" element={<AdminProtectedRoute><VerificationDashboard /></AdminProtectedRoute>} />
        <Route path="/admin/dashboard" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
      </Routes>
    </>
  );
}
