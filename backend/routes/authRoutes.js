// routes/authRoutes.js

const express = require("express");
const { registerUser, loginUser, getUserInfo, updateProfile } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserInfo);
router.put("/profile", protect, updateProfile);

module.exports = router;
