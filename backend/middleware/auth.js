import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const authMiddleware = async (req, res, next) => {
  try {
    // Check for token in cookies first, then headers
    const token = req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ 
        success: false,
        msg: "No token, authorization denied" 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Try both userId and id (for compatibility)
    const userId = decoded.userId || decoded.id;
    
    // Check if user still exists
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(401).json({ 
        success: false,
        msg: "User no longer exists" 
      });
    }

    // Check if user is verified (optional) - check both verified and isVerified fields
    if (!user.verified && !user.isVerified) {
      return res.status(401).json({ 
        success: false,
        msg: "Please verify your email first" 
      });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err.message);
    
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false,
        msg: "Invalid token" 
      });
    }
    
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        msg: "Token expired, please login again" 
      });
    }

    res.status(500).json({ 
      success: false,
      msg: "Server error in authentication" 
    });
  }
};
