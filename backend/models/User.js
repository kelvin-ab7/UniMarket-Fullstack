import mongoose from "mongoose";

// Updated email pattern to validate both Gmail and KNUST emails
const emailPattern = /^[a-zA-Z0-9._%+-]+@(gmail\.com|(st\.)?knust\.edu\.gh)$/;

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: emailPattern,
      validate: {
        validator: function(email) {
          return emailPattern.test(email);
        },
        message: 'Email must be a valid Gmail (@gmail.com) or KNUST email (@knust.edu.gh or @st.knust.edu.gh)'
      }
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "",
    },
    phone: {
      type: Number,
      required: true,
    },
    bio: {
      type: String,
      default: "",
    },
    // Student verification fields
    isVerified: {
      type: Boolean,
      default: false,
    },
    studentIdImage: {
      type: String,
      default: "",
    },
    studentIdUploaded: {
      type: Boolean,
      default: false,
    },
    studentIdVerified: {
      type: Boolean,
      default: false,
    },
    studentIdVerifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    studentIdVerifiedAt: {
      type: Date,
      default: null,
    },
    // Email verification fields
    verified: {
      type: Boolean,
      default: false,
    },
    reset_OTP: {
      type: Number,
    },
    // Role and admin fields
    role: {
      type: String,
      enum: ['student', 'admin'],
      default: 'student',
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    // Vendor badge system
    vendorBadge: {
      type: String,
      enum: ['none', 'bronze', 'silver', 'gold', 'platinum', 'diamond'],
      default: 'none',
    },
    badgeAssignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    badgeAssignedAt: {
      type: Date,
      default: null,
    },
    badgeReason: {
      type: String,
      default: "",
    },
    // Admin privileges
    canManageUsers: {
      type: Boolean,
      default: false,
    },
    canManageProducts: {
      type: Boolean,
      default: false,
    },
    canManageBadges: {
      type: Boolean,
      default: false,
    },
    canViewAnalytics: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model("User", userSchema);
