// controllers/authController.js

const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// Register User
exports.registerUser = async (req, res) => {
  const { fullName, email, password, profileImageUrl } = req.body;
  if (!fullName || !email || !password) {
    return res.status(400).json({ success: false, message: "Please fill all required fields" });
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ success: false, message: "Email already in use" });

    const user = await User.create({ fullName, email, password, profileImageUrl });
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: { id: user._id, fullName: user.fullName, email: user.email, profileImageUrl: user.profileImageUrl, currency: user.currency, monthlyBudget: user.monthlyBudget, token: generateToken(user._id) },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error registering user", error: error.message });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ success: false, message: "Please fill all required fields" });
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ success: false, message: "Invalid email or password" });

    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) return res.status(401).json({ success: false, message: "Invalid email or password" });

    res.json({ success: true, message: "Login successful", data: { id: user._id, fullName: user.fullName, email: user.email, profileImageUrl: user.profileImageUrl, currency: user.currency, monthlyBudget: user.monthlyBudget, token: generateToken(user._id) } });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error logging in", error: error.message });
  }
};

// Get User Info
exports.getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching user info", error: error.message });
  }
};

// Update User Profile
exports.updateProfile = async (req, res) => {
  try {
    const { fullName, currency, monthlyBudget } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { fullName, currency, monthlyBudget },
      { new: true, runValidators: true }
    ).select("-password");
    res.json({ success: true, message: "Profile updated successfully", data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating profile", error: error.message });
  }
};
