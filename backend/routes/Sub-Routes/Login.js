import { User } from "../../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

export const Login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ msg: "Please fill in all fields" });
    }

    // Check for admin credentials first
    const adminCredentials = [
      { email: "admin@knust.edu.gh", password: "admin123" },
      { email: "admin1@knust.edu.gh", password: "admin123" },
      { email: "admin2@knust.edu.gh", password: "admin456" },
      { email: "admin3@knust.edu.gh", password: "admin789" }
    ];

    const adminCredential = adminCredentials.find(cred => cred.email === email);
    
    if (adminCredential && adminCredential.password === password) {
      // Create or find admin user
      let adminUser = await User.findOne({ email });
      
      if (!adminUser) {
        // Create new admin user
        adminUser = new User({
          username: `Admin_${email.split('@')[0]}`,
          email: email,
          password: await bcrypt.hash(password, 10),
          role: 'admin',
          isAdmin: true,
          canManageUsers: true,
          canManageProducts: true,
          canManageBadges: true,
          canViewAnalytics: true,
          phone: 0,
          isVerified: true,
          emailVerified: true
        });
        await adminUser.save();
      } else {
        // Update existing user to admin
        adminUser.role = 'admin';
        adminUser.isAdmin = true;
        adminUser.canManageUsers = true;
        adminUser.canManageProducts = true;
        adminUser.canManageBadges = true;
        adminUser.canViewAnalytics = true;
        adminUser.isVerified = true;
        adminUser.emailVerified = true;
        await adminUser.save();
      }

      const token = jwt.sign({ userId: adminUser._id }, process.env.JWT_SECRET, {
        expiresIn: "24h",
      });

      res.cookie("token", token, { httpOnly: true });
      res.status(200).json({ 
        msg: "Admin logged in successfully", 
        token,
        user: {
          id: adminUser._id,
          username: adminUser.username,
          email: adminUser.email,
          role: adminUser.role,
          isAdmin: adminUser.isAdmin
        }
      });
      return;
    }

    // Regular user login
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User does not exist" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Check if user is admin and handle accordingly
    if (user.role === 'admin') {
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "24h",
      });

      res.cookie("token", token, { httpOnly: true });
      res.status(200).json({ 
        msg: "Admin logged in successfully", 
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          isAdmin: user.isAdmin
        }
      });
      return;
    }

    // Ensure regular users have student role
    if (user.role !== 'student') {
      user.role = 'student';
      await user.save();
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.cookie("token", token, { httpOnly: true });
    res.status(200).json({ 
      msg: "User logged in successfully", 
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ msg: error.message });
  }
};

export const dashboard = async (req, res) => {
  try {
    // res.send("Welcome to the dashboard");
    res.status(200).json({ msg: "Welcome to the dashboard" });
  } catch (error) {
    // res.send(error.message);
    res.status(500).json({ msg: error.message });
  }
};

export const Logout = async (req, res) => {
  try {
    res.clearCookie("token");
    // res.send("User logged out successfully");
    res.status(200).json({ msg: "User logged out successfully" });
  } catch (error) {
    // res.send(error.message);
    res.status(500).json({ msg: error.message });
  }
};
