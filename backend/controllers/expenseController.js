const Expense = require("../models/Expense");
const User = require("../models/User");

// ======================== CREATE EXPENSE (with card tracking) ========================
// @desc    Create expense with card tracking
// @route   POST /api/v1/expenses
// @access  Private
exports.createExpense = async (req, res) => {
  try {
    const { 
      title, 
      amount, 
      category, 
      description, 
      date, 
      paymentMethod, 
      isRecurring, 
      recurringType,
      cardId // For card association
    } = req.body;

    let cardUsed = null;

    // If payment method involves a card
    if ((paymentMethod === "Credit Card" || paymentMethod === "Debit Card") && cardId) {
      const user = await User.findById(req.user.id);
      const card = user.cards.id(cardId);

      if (!card) {
        return res.status(404).json({ success: false, message: "Card not found" });
      }

      if (!card.isActive) {
        return res.status(400).json({ success: false, message: "This card is not active" });
      }

      cardUsed = {
        cardType: card.cardType,
        cardName: card.cardName,
        lastFourDigits: card.lastFourDigits
      };

      // Update card balance (demo logic)
      if (card.cardType === "credit") {
        card.currentBalance += amount;
        await user.save();
      }
    }

    const expense = await Expense.create({
      title,
      amount,
      category,
      description,
      date: date || Date.now(),
      paymentMethod,
      cardUsed,
      isRecurring,
      recurringType,
      user: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Expense created successfully",
      data: expense,
    });
  } catch (error) {
    console.error("Create expense error:", error);
    res.status(400).json({
      success: false,
      message: "Error creating expense",
      error: error.message,
    });
  }
};

// ======================== GET ALL EXPENSES ========================
// @desc    Get all expenses for a user with filters
// @route   GET /api/v1/expenses
// @access  Private
exports.getExpenses = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, startDate, endDate, search } = req.query;

    let filter = { user: req.user.id };

    if (category && category !== 'all') filter.category = category;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const expenses = await Expense.find(filter)
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Expense.countDocuments(filter);

    res.json({
      success: true,
      data: expenses,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / limit),
        totalExpenses: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Get expenses error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching expenses",
      error: error.message,
    });
  }
};

// ======================== GET SINGLE EXPENSE ========================
// @desc    Get single expense
// @route   GET /api/v1/expenses/:id
// @access  Private
exports.getExpense = async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!expense) {
      return res.status(404).json({ success: false, message: "Expense not found" });
    }

    res.json({ success: true, data: expense });
  } catch (error) {
    console.error("Get expense error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching expense",
      error: error.message,
    });
  }
};

// ======================== UPDATE EXPENSE ========================
// @desc    Update expense
// @route   PUT /api/v1/expenses/:id
// @access  Private
exports.updateExpense = async (req, res) => {
  try {
    let expense = await Expense.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!expense) {
      return res.status(404).json({ success: false, message: "Expense not found" });
    }

    expense = await Expense.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      message: "Expense updated successfully",
      data: expense,
    });
  } catch (error) {
    console.error("Update expense error:", error);
    res.status(400).json({
      success: false,
      message: "Error updating expense",
      error: error.message,
    });
  }
};

// ======================== DELETE EXPENSE ========================
// @desc    Delete expense
// @route   DELETE /api/v1/expenses/:id
// @access  Private
exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!expense) {
      return res.status(404).json({ success: false, message: "Expense not found" });
    }

    await Expense.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Expense deleted successfully",
    });
  } catch (error) {
    console.error("Delete expense error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting expense",
      error: error.message,
    });
  }
};

// ======================== GET EXPENSES BY CARD ========================
// @desc    Get expenses associated with a specific card
// @route   GET /api/v1/expenses/card/:cardId
// @access  Private
exports.getExpensesByCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const user = await User.findById(req.user.id);
    const card = user.cards.id(cardId);

    if (!card) {
      return res.status(404).json({ success: false, message: "Card not found" });
    }

    const expenses = await Expense.find({
      user: req.user.id,
      "cardUsed.lastFourDigits": card.lastFourDigits,
      "cardUsed.cardType": card.cardType
    })
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Expense.countDocuments({
      user: req.user.id,
      "cardUsed.lastFourDigits": card.lastFourDigits,
      "cardUsed.cardType": card.cardType
    });

    res.json({
      success: true,
      data: expenses,
      cardDetails: {
        cardName: card.cardName,
        cardType: card.cardType,
        lastFourDigits: card.lastFourDigits,
        bankName: card.bankName,
      },
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / limit),
        totalExpenses: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Get expenses by card error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching card expenses",
      error: error.message,
    });
  }
};

// ======================== CATEGORY SUMMARY ========================
// @desc    Get total expenses summary by category
// @route   GET /api/v1/expenses/summary/category
// @access  Private
exports.getCategorySummary = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let match = { user: req.user.id };
    if (startDate || endDate) {
      match.date = {};
      if (startDate) match.date.$gte = new Date(startDate);
      if (endDate) match.date.$lte = new Date(endDate);
    }

    const summary = await Expense.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$category",
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { totalAmount: -1 } },
    ]);

    res.json({ success: true, data: summary });
  } catch (error) {
    console.error("Category summary error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching category summary",
      error: error.message,
    });
  }
};

// ======================== MONTHLY SUMMARY ========================
// @desc    Get total monthly expenses
// @route   GET /api/v1/expenses/summary/monthly
// @access  Private
exports.getMonthlySummary = async (req, res) => {
  try {
    const summary = await Expense.aggregate([
      { $match: { user: req.user.id } },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
          },
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
      { $limit: 12 },
    ]);

    res.json({ success: true, data: summary });
  } catch (error) {
    console.error("Monthly summary error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching monthly summary",
      error: error.message,
    });
  }
};
