const express = require("express");
const {
  getDashboardOverview,
  getFinancialStats,
  getCardAnalytics
} = require("../controllers/dashboardController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.get("/overview", getDashboardOverview);
router.get("/stats", getFinancialStats);
router.get("/card-analytics", getCardAnalytics);

module.exports = router;