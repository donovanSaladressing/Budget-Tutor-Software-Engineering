const express = require("express");
const {
  getExpenses,
  getExpense,
  createExpense,
  updateExpense,
  deleteExpense,
  getCategorySummary,
  getMonthlySummary,
  getExpensesByCard // Add this import
} = require("../controllers/expenseController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// All routes are protected
router.use(protect);

router.route("/")
  .get(getExpenses)
  .post(createExpense);

router.route("/card/:cardId")
  .get(getExpensesByCard);

router.route("/summary/category")
  .get(getCategorySummary);

router.route("/summary/monthly")
  .get(getMonthlySummary);

router.route("/:id")
  .get(getExpense)
  .put(updateExpense)
  .delete(deleteExpense);

module.exports = router;