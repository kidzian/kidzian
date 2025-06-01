const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Teacher = require("../models/Teacher");
const Admin = require("../models/Admin");

// Login route for all user types
router.post("/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;
    console.log("Login attempt:", { email, role });

    if (!email || !password || !role) {
      console.log("Missing credentials in request body");
      return res.status(400).json({ message: "Please provide email, password, and role" });
    }

    const emailNormalized = email.toLowerCase();
    let user;

    // Find user based on role and explicitly include password
    if (role === "admin") {
      console.log("Looking for admin user");
      user = await Admin.findOne({ email: emailNormalized }).select("+password");
    } else if (role === "teacher") {
      console.log("Looking for teacher user");
      user = await Teacher.findOne({ email: emailNormalized }).select("+password");
    } else {
      console.log("Looking for regular user");
      user = await User.findOne({ email: emailNormalized }).select("+password");
    }

    if (!user) {
      console.log("No user found with email:", emailNormalized);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Verify password
    if (!user.password) {
      console.log("User exists but password is undefined!");
      return res.status(500).json({ message: "Server misconfiguration: password missing" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match:", isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Create token payload
    const payload = {
      id: user._id,
      role,
    };

    // Sign token
    const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "1d" });
    console.log("Token created for user ID:", user._id);

    // Return user info (excluding password)
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      token,
      user: {
        ...userResponse,
        role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Verify token route
router.get("/verify", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    console.log("Token decoded:", decoded);

    // Find user based on role
    let user;
    if (decoded.role === "admin") {
      user = await Admin.findById(decoded.id).select("-password");
    } else if (decoded.role === "teacher") {
      user = await Teacher.findById(decoded.id).select("-password");
    } else {
      user = await User.findById(decoded.id).select("-password");
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      user,
      role: decoded.role,
    });
  } catch (err) {
    console.error("Token verification error:", err);
    res.status(401).json({ message: "Token is not valid" });
  }
});

module.exports = router;
