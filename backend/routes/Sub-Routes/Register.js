// Routes for Register and Verify are defined in this file
import { User } from "../../models/User.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import Token from "../../middleware/tokenizer.js";
import sendMailVerify from "../../config/MailVerify.js";

export const Register = async (req, res, next) => {
  try {
    const { username, email, password, confirmPassword, phone } = req.body;
    if (!username || !email || !password || !confirmPassword || !phone) {
      return res.status(400).json({ msg: "Please fill in all fields" });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ msg: "Passwords do not match" });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        phone,
        verified: true, // <-- Automatically verify user
      });
      await newUser.save();
      res.status(200).json({
        msg: "User registered successfully",
      });

      // The following code is disabled for now:
      // // generate token
      // const token = crypto.randomBytes(32).toString("hex");
      // const newToken = new Token({
      //   userId: newUser._id,
      //   token,
      // });
      // await newToken.save();
      // console.log("Token saved successfully");
      // const link = `http://localhost:3005/account/verify/${token}`;
      // await sendMailVerify(email, link);
      // console.log("Email sent successfully");
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Link to verify account
export const Verify = async (req, res) => {
  try {
    const token = await Token.findOne({ token: req.params.token });
    if (!token) {
      // return res.send("Invalid token");
      return res.status(400).json({ msg: "Invalid token" });
    }
    const user = await User.findOne({ _id: token.userId });
    if (!user) {
      // return res.send("User does not exist");
      return res.status(400).json({ msg: "User does not exist" });
    }
    user.verified = true;
    await user.save();
    // res.send("Account verified successfully");
    res.status(200).json({ msg: "Account verified successfully" });
  } catch (error) {
    // res.send(error.message);
    res.status(500).json({ msg: error.message });
  }
};

// Another code of link to verify account
// export const Verify = async (req, res) => {
//   try {
//     const token = await Token.findOne({ token: req.params.token });
//     console.log(token);
//     await User.updateOne({ _id: token.userId }, { $set: { verified: true } });
//     await Token.findByIdAndDelete(token._id);
//     res.send("Account verified successfully");
//   } catch (error) {
//     res.send(error.message);
//   }
// };
