import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const adminAuth = async (req, res, next) => {
  try {
    // Check for token in cookies first, then headers
    const token = req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ msg: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Try both userId and id (for compatibility)
    const userId = decoded.userId || decoded.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({ msg: "Invalid token. User not found." });
    }

    // Check if user is admin
    if (user.role !== 'admin' || !user.isAdmin) {
      return res.status(403).json({ msg: "Access denied. Admin privileges required." });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Admin auth error:", error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ msg: "Invalid token" });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ msg: "Token expired, please login again" });
    }

    res.status(401).json({ msg: "Invalid token." });
  }
};

// Middleware for specific admin privileges
export const requirePrivilege = (privilege) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ msg: "Authentication required." });
    }

    if (!req.user[privilege]) {
      return res.status(403).json({ msg: `Access denied. ${privilege} privilege required.` });
    }

    next();
  };
};
