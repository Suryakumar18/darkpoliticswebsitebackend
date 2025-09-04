// api/auth.js
const express = require("express");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const User = require("../models/User");
const Token = require("../models/Token");

const router = express.Router();

// Login API
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // Generate unique token
    const tokenValue = crypto.randomBytes(32).toString("hex");

    // Delete any existing tokens for this user
    await Token.deleteMany({ userId: user._id });

    // Create new token
    const newToken = new Token({
      userId: user._id,
      token: tokenValue
    });

    await newToken.save();

    // Return success response with token and user details
    res.status(200).json({
      success: true,
      message: "Login successful",
      token: tokenValue,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

// Verify token API (optional - for checking if user is authenticated)
router.get("/verify", async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided"
      });
    }

    // Find token in database
    const tokenDoc = await Token.findOne({ token }).populate("userId", "name email createdAt");
    
    if (!tokenDoc) {
      return res.status(401).json({
        success: false,
        message: "Invalid token"
      });
    }

    res.status(200).json({
      success: true,
      message: "Token is valid",
      user: {
        id: tokenDoc.userId._id,
        name: tokenDoc.userId.name,
        email: tokenDoc.userId.email,
        createdAt: tokenDoc.userId.createdAt
      }
    });

  } catch (error) {
    console.error("Token verification error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

// Logout API
router.post("/logout", async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided"
      });
    }

    // Delete token from database
    await Token.deleteOne({ token });

    res.status(200).json({
      success: true,
      message: "Logout successful"
    });

  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

module.exports = router;