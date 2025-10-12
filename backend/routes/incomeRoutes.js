const express = require("express");
const {
  getIncomes,
  getIncome,
  createIncome,
  updateIncome,
  deleteIncome,
  getCategorySummary,
} = require("../controllers/incomeController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// All routes are protected
router.use(protect);

router.route("/")
  .get(getIncomes)
  .post(createIncome);

router.route("/summary/category")
  .get(getCategorySummary);

router.route("/:id")
  .get(getIncome)
  .put(updateIncome)
  .delete(deleteIncome);

module.exports = router;