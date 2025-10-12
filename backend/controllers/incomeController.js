const Income = require("../models/Income");

// @desc    Get all incomes for a user with filters
// @route   GET /api/v1/incomes
// @access  Private
exports.getIncomes = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, startDate, endDate, search } = req.query;
    
    // Build filter object
    let filter = { user: req.user.id };
    
    if (category && category !== 'all') {
      filter.category = category;
    }
    
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

    const incomes = await Income.find(filter)
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Income.countDocuments(filter);

    res.json({
      success: true,
      data: incomes,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalIncomes: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error("Get incomes error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching incomes",
      error: error.message,
    });
  }
};

// @desc    Get single income
// @route   GET /api/v1/incomes/:id
// @access  Private
exports.getIncome = async (req, res) => {
  try {
    const income = await Income.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!income) {
      return res.status(404).json({
        success: false,
        message: "Income not found",
      });
    }

    res.json({
      success: true,
      data: income,
    });
  } catch (error) {
    console.error("Get income error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching income",
      error: error.message,
    });
  }
};

// @desc    Create income
// @route   POST /api/v1/incomes
// @access  Private
exports.createIncome = async (req, res) => {
  try {
    const { title, amount, category, description, date, source, isRecurring, recurringType } = req.body;

    const income = await Income.create({
      title,
      amount,
      category,
      description,
      date: date || Date.now(),
      source,
      isRecurring,
      recurringType,
      user: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Income created successfully",
      data: income,
    });
  } catch (error) {
    console.error("Create income error:", error);
    res.status(400).json({
      success: false,
      message: "Error creating income",
      error: error.message,
    });
  }
};

// @desc    Update income
// @route   PUT /api/v1/incomes/:id
// @access  Private
exports.updateIncome = async (req, res) => {
  try {
    let income = await Income.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!income) {
      return res.status(404).json({
        success: false,
        message: "Income not found",
      });
    }

    income = await Income.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      message: "Income updated successfully",
      data: income,
    });
  } catch (error) {
    console.error("Update income error:", error);
    res.status(400).json({
      success: false,
      message: "Error updating income",
      error: error.message,
    });
  }
};

// @desc    Delete income
// @route   DELETE /api/v1/incomes/:id
// @access  Private
exports.deleteIncome = async (req, res) => {
  try {
    const income = await Income.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!income) {
      return res.status(404).json({
        success: false,
        message: "Income not found",
      });
    }

    await Income.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Income deleted successfully",
    });
  } catch (error) {
    console.error("Delete income error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting income",
      error: error.message,
    });
  }
};

// @desc    Get income summary by category
// @route   GET /api/v1/incomes/summary/category
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

    const incomes = await Income.aggregate([
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

    res.json({
      success: true,
      data: incomes,
    });
  } catch (error) {
    console.error("Income category summary error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching income category summary",
      error: error.message,
    });
  }
};