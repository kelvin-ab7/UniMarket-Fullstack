import express from "express";
import { adminAuth, requirePrivilege } from "../middleware/adminAuth.js";
import { User } from "../models/User.js";
import { Product } from "../models/Product.js";

const router = express.Router();

// Test route to check if admin auth is working
router.get("/test", adminAuth, (req, res) => {
  res.json({ msg: "Admin auth working", user: req.user });
});

// Apply admin authentication to all routes
router.use(adminAuth);

// Get admin dashboard data
router.get("/dashboard", async (req, res) => {
  try {
    const pendingVerifications = await User.find({
      studentIdUploaded: true,
      studentIdVerified: false,
      role: 'student'
    }).select('username email studentIdImage createdAt');

    const totalUsers = await User.countDocuments({ role: 'student' });
    const totalProducts = await Product.countDocuments();
    const verifiedUsers = await User.countDocuments({ 
      role: 'student', 
      studentIdVerified: true 
    });

    const badgeStats = await User.aggregate([
      { $match: { role: 'student' } },
      { $group: { _id: '$vendorBadge', count: { $sum: 1 } } }
    ]);

    res.json({
      pendingVerifications,
      stats: {
        totalUsers,
        totalProducts,
        verifiedUsers,
        badgeStats
      }
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);
    res.status(500).json({ msg: "Failed to fetch dashboard data" });
  }
});

// Get all pending student ID verifications
router.get("/verifications", requirePrivilege('canManageUsers'), async (req, res) => {
  try {
    const verifications = await User.find({
      studentIdUploaded: true,
      studentIdVerified: false,
      role: 'student'
    }).select('username email studentIdImage createdAt bio phone');

    res.json(verifications);
  } catch (error) {
    console.error("Get verifications error:", error);
    res.status(500).json({ msg: "Failed to fetch verifications" });
  }
});

// Approve student ID verification
router.post("/verify-student/:userId", requirePrivilege('canManageUsers'), async (req, res) => {
  try {
    const { userId } = req.params;
    const { approved, reason } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (approved) {
      user.studentIdVerified = true;
      user.studentIdVerifiedBy = req.user._id;
      user.studentIdVerifiedAt = new Date();
      user.isVerified = true;
    } else {
      user.studentIdUploaded = false;
      user.studentIdImage = "";
    }

    await user.save();

    res.json({ 
      msg: approved ? "Student ID approved successfully" : "Student ID rejected",
      user 
    });
  } catch (error) {
    console.error("Verify student error:", error);
    res.status(500).json({ msg: "Failed to verify student" });
  }
});

// Get all users for management
router.get("/users", requirePrivilege('canManageUsers'), async (req, res) => {
  try {
    const users = await User.find({ role: 'student' })
      .select('username email vendorBadge studentIdVerified createdAt isVerified')
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ msg: "Failed to fetch users" });
  }
});

// Assign vendor badge
router.post("/assign-badge/:userId", requirePrivilege('canManageBadges'), async (req, res) => {
  try {
    const { userId } = req.params;
    const { badge, reason } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    user.vendorBadge = badge;
    user.badgeAssignedBy = req.user._id;
    user.badgeAssignedAt = new Date();
    user.badgeReason = reason || "";

    await user.save();

    res.json({ 
      msg: `Badge ${badge} assigned successfully`,
      user 
    });
  } catch (error) {
    console.error("Assign badge error:", error);
    res.status(500).json({ msg: "Failed to assign badge" });
  }
});

// Remove vendor badge
router.post("/remove-badge/:userId", requirePrivilege('canManageBadges'), async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    user.vendorBadge = 'none';
    user.badgeAssignedBy = null;
    user.badgeAssignedAt = null;
    user.badgeReason = "";

    await user.save();

    res.json({ 
      msg: "Badge removed successfully",
      user 
    });
  } catch (error) {
    console.error("Remove badge error:", error);
    res.status(500).json({ msg: "Failed to remove badge" });
  }
});

// Get all products for management
router.get("/products", requirePrivilege('canManageProducts'), async (req, res) => {
  try {
    const products = await Product.find()
      .populate('user', 'username email vendorBadge')
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ msg: "Failed to fetch products" });
  }
});

// Delete product (admin override)
router.delete("/delete-product/:productId", requirePrivilege('canManageProducts'), async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findByIdAndDelete(productId);
    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    res.json({ msg: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ msg: "Failed to delete product" });
  }
});

// Get analytics data
router.get("/analytics", requirePrivilege('canViewAnalytics'), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'student' });
    const totalProducts = await Product.countDocuments();
    const verifiedUsers = await User.countDocuments({ 
      role: 'student', 
      studentIdVerified: true 
    });

    const monthlyUsers = await User.aggregate([
      { $match: { role: 'student' } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }
    ]);

    const badgeDistribution = await User.aggregate([
      { $match: { role: 'student' } },
      { $group: { _id: '$vendorBadge', count: { $sum: 1 } } }
    ]);

    res.json({
      totalUsers,
      totalProducts,
      verifiedUsers,
      monthlyUsers,
      badgeDistribution
    });
  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({ msg: "Failed to fetch analytics" });
  }
});

export default router;
