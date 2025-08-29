import express from "express";

import path from "path";
import multer from "multer";

import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Routes
import { Register, VerifyOTP, ResendOTP, DeleteUser } from "./Sub-Routes/Register.js";
import { Login, dashboard, Logout } from "./Sub-Routes/Login.js";
import {
  sendingOTP,
  verifyOTP,
  resetPassword,
} from "./Sub-Routes/ResetPassword.js";
import {
  PostProduct,
  GetProduct,
  GetProductId,
} from "./Sub-Routes/ProductRoutes.js";
import { GetSeller } from "./Sub-Routes/Profile.js";
import { authMiddleware } from "../middleware/auth.js";
import {
  uploadStudentID,
  getPendingVerifications,
  verifyStudentID,
  getUserVerificationStatus,
} from "./Sub-Routes/StudentVerification.js";

const router = express.Router();

const storage = multer.diskStorage({
  // destination: function (req, file, cb) {
  //   cb(null, "../frontend/src/assets/Images/");
  // },
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.get("/", (req, res) => {
  res.send("Hello from the backend!, main.js Home");
});

// account
router.post("/register", Register);
router.post("/verify-otp", VerifyOTP);
router.post("/resend-otp", ResendOTP);
router.post("/delete-user", DeleteUser);
router.post("/login", Login);

router.post("/send-otp-password", sendingOTP);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);
router.get("/dashboard", authMiddleware, dashboard);
router.get("/logout", Logout);
router.post(
  "/post-product",
  upload.single("image"),
  authMiddleware,
  PostProduct
);
router.get("/get-product", GetProduct);
router.get("/get-product/:id", GetProductId);

// Student verification routes
router.post("/upload-student-id", authMiddleware, uploadStudentID);
router.get("/verification-status", authMiddleware, getUserVerificationStatus);
router.get("/pending-verifications", authMiddleware, getPendingVerifications);
router.post("/verify-student-id", authMiddleware, verifyStudentID);

export default router;
