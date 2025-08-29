import { User } from "../../models/User.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configure multer for student ID uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../uploads/student-ids"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "student-id-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only images
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Upload student ID
export const uploadStudentID = async (req, res) => {
  try {
    // Use multer middleware directly
    upload.single('studentId')(req, res, async (err) => {
      if (err) {
        console.error("Multer error:", err);
        return res.status(400).json({ msg: err.message });
      }

      if (!req.file) {
        return res.status(400).json({ msg: "Please upload a student ID image" });
      }

      const userId = req.user._id;
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }

      if (user.studentIdVerified) {
        return res.status(400).json({ msg: "Student ID already verified" });
      }

      // Update user with student ID image and set uploaded status
      user.studentIdImage = req.file.filename;
      user.studentIdUploaded = true; // Add this field to track upload status
      await user.save();

      console.log("Student ID uploaded successfully:", req.file.filename);

      res.status(200).json({ 
        msg: "Student ID uploaded successfully! Waiting for admin verification.",
        studentIdImage: req.file.filename
      });
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ msg: error.message });
  }
};

// Get pending student ID verifications (admin only)
export const getPendingVerifications = async (req, res) => {
  try {
    // Check if user is admin (you can implement admin role checking)
    const isAdmin = req.user.isAdmin; // You'll need to add this field to User model
    if (!isAdmin) {
      return res.status(403).json({ msg: "Access denied. Admin only." });
    }

    const pendingUsers = await User.find({
      studentIdImage: { $ne: "" },
      studentIdVerified: false
    }).select('username email studentIdImage createdAt');

    res.status(200).json(pendingUsers);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Verify student ID (admin only)
export const verifyStudentID = async (req, res) => {
  try {
    const { userId, verified } = req.body;
    
    // Check if user is admin
    const isAdmin = req.user.isAdmin;
    if (!isAdmin) {
      return res.status(403).json({ msg: "Access denied. Admin only." });
    }

    if (!userId || typeof verified !== 'boolean') {
      return res.status(400).json({ msg: "User ID and verification status are required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (!user.studentIdImage) {
      return res.status(400).json({ msg: "No student ID uploaded for this user" });
    }

    if (user.studentIdVerified) {
      return res.status(400).json({ msg: "Student ID already verified" });
    }

    // Update verification status
    user.studentIdVerified = verified;
    user.studentIdVerifiedBy = req.user._id;
    user.studentIdVerifiedAt = new Date();
    user.isVerified = verified; // Update the main verification status

    await user.save();

    const status = verified ? "verified" : "rejected";
    res.status(200).json({ 
      msg: `Student ID ${status} successfully`,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        studentIdVerified: user.studentIdVerified
      }
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Get user verification status
export const getUserVerificationStatus = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select('username email studentIdImage studentIdVerified isVerified emailVerified');

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        emailVerified: user.emailVerified,
        studentIdUploaded: !!user.studentIdImage,
        studentIdVerified: user.studentIdVerified,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
