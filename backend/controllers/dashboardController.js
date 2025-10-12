const Expense = require("../models/Expense");
const Income = require("../models/Income");
const User = require("../models/User");

// ======================== DASHBOARD OVERVIEW ========================
// @desc    Get dashboard overview
// @route   GET /api/v1/dashboard/overview
// @access  Private
exports.getDashboardOverview = async (req, res) => {
  try {
    const userId = req.user.id;
    const { startDate, endDate } = req.query;
    
    // Build date filter
    let dateFilter = { user: userId };
    if (startDate || endDate) {
      dateFilter.date = {};
      if (startDate) dateFilter.date.$gte = new Date(startDate);
      if (endDate) dateFilter.date.$lte = new Date(endDate);
    }

    const [
      totalIncome,
      totalExpense, 
      recentExpenses,
      recentIncomes,
      expensesByCategory,
      incomeByCategory
    ] = await Promise.all([
      // Total Income
      Income.aggregate([
        { $match: dateFilter },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]),
      // Total Expense
      Expense.aggregate([
        { $match: dateFilter },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]),
      // Recent Expenses
      Expense.find(dateFilter)
        .sort({ date: -1 })
        .limit(5)
        .select('title amount category date'),
      // Recent Incomes  
      Income.find(dateFilter)
        .sort({ date: -1 })
        .limit(5)
        .select('title amount category date'),
      // Expenses by Category
      Expense.aggregate([
        { $match: dateFilter },
        {
          $group: {
            _id: "$category",
            total: { $sum: "$amount" },
            count: { $sum: 1 }
          }
        },
        { $sort: { total: -1 } }
      ]),
      // Income by Category
      Income.aggregate([
        { $match: dateFilter },
        {
          $group: {
            _id: "$category",
            total: { $sum: "$amount" },
            count: { $sum: 1 }
          }
        },
        { $sort: { total: -1 } }
      ])
    ]);

    // Combine recent transactions
    const recentTransactions = [
      ...recentExpenses.map(expense => ({ 
        ...expense.toObject(), 
        type: 'expense' 
      })),
      ...recentIncomes.map(income => ({ 
        ...income.toObject(), 
        type: 'income' 
      }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date))
     .slice(0, 10);

    res.json({
      success: true,
      data: {
        totalIncome: totalIncome[0]?.total || 0,
        totalExpense: totalExpense[0]?.total || 0,
        balance: (totalIncome[0]?.total || 0) - (totalExpense[0]?.total || 0),
        recentTransactions,
        expensesByCategory,
        incomeByCategory
      },
    });
  } catch (error) {
    console.error("Dashboard overview error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching dashboard overview",
      error: error.message,
    });
  }
};

// ======================== FINANCIAL STATS ========================
// @desc    Get financial statistics
// @route   GET /api/v1/dashboard/stats
// @access  Private
exports.getFinancialStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const currentDate = new Date();
    
    // Date ranges for current and last month
    const currentMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const currentMonthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const lastMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    const lastMonthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);

    // Current month stats
    const [currentMonthExpenses, currentMonthIncome] = await Promise.all([
      Expense.aggregate([
        { 
          $match: { 
            user: userId,
            date: { $gte: currentMonthStart, $lte: currentMonthEnd }
          } 
        },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]),
      Income.aggregate([
        { 
          $match: { 
            user: userId,
            date: { $gte: currentMonthStart, $lte: currentMonthEnd }
          } 
        },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ])
    ]);

    // Last month stats
    const [lastMonthExpenses, lastMonthIncome] = await Promise.all([
      Expense.aggregate([
        { 
          $match: { 
            user: userId,
            date: { $gte: lastMonthStart, $lte: lastMonthEnd }
          } 
        },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]),
      Income.aggregate([
        { 
          $match: { 
            user: userId,
            date: { $gte: lastMonthStart, $lte: lastMonthEnd }
          } 
        },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ])
    ]);

    // Monthly trend data
    const monthlyStats = await Expense.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: { year: { $year: "$date" }, month: { $month: "$date" } },
          totalExpense: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
      { $limit: 12 },
    ]);

    const stats = {
      currentMonth: {
        expenses: currentMonthExpenses[0]?.total || 0,
        income: currentMonthIncome[0]?.total || 0,
        balance: (currentMonthIncome[0]?.total || 0) - (currentMonthExpenses[0]?.total || 0)
      },
      lastMonth: {
        expenses: lastMonthExpenses[0]?.total || 0,
        income: lastMonthIncome[0]?.total || 0,
        balance: (lastMonthIncome[0]?.total || 0) - (lastMonthExpenses[0]?.total || 0)
      },
      monthlyTrend: monthlyStats.reverse(),
      expenseChange: calculatePercentageChange(
        currentMonthExpenses[0]?.total || 0,
        lastMonthExpenses[0]?.total || 0
      ),
      incomeChange: calculatePercentageChange(
        currentMonthIncome[0]?.total || 0,
        lastMonthIncome[0]?.total || 0
      )
    };

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Financial stats error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching financial stats",
      error: error.message,
    });
  }
};

// ======================== CARD ANALYTICS ========================
// @desc    Get card analytics
// @route   GET /api/v1/dashboard/card-analytics
// @access  Private
exports.getCardAnalytics = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("cards");

    // Spending by card type
    const spendingByCardType = await Expense.aggregate([
      {
        $match: {
          user: req.user._id,
          paymentMethod: { $in: ["Credit Card", "Debit Card"] },
        },
      },
      {
        $group: {
          _id: "$paymentMethod",
          totalSpent: { $sum: "$amount" },
          transactionCount: { $sum: 1 },
          averageSpend: { $avg: "$amount" },
        },
      },
    ]);

    // Monthly card spending
    const monthlyCardSpending = await Expense.aggregate([
      {
        $match: {
          user: req.user._id,
          paymentMethod: { $in: ["Credit Card", "Debit Card"] },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
            cardType: "$paymentMethod",
          },
          totalSpent: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
      { $limit: 12 },
    ]);

    // Top categories for card spending
    const cardSpendingByCategory = await Expense.aggregate([
      {
        $match: {
          user: req.user._id,
          paymentMethod: { $in: ["Credit Card", "Debit Card"] },
        },
      },
      {
        $group: {
          _id: "$category",
          totalSpent: { $sum: "$amount" },
          transactionCount: { $sum: 1 },
        },
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 5 },
    ]);

    const cardAnalytics = {
      spendingByCardType,
      monthlyCardSpending: monthlyCardSpending.reverse(),
      cardSpendingByCategory,
      totalCards: user.cards.length,
      activeCards: user.cards.filter((card) => card.isActive).length,
      creditCards: user.cards.filter((card) => card.cardType === "credit").length,
      debitCards: user.cards.filter((card) => card.cardType === "debit").length,
    };

    res.json({
      success: true,
      data: cardAnalytics,
    });
  } catch (error) {
    console.error("Card analytics error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching card analytics",
      error: error.message,
    });
  }
};

// Helper function to calculate percentage change
function calculatePercentageChange(current, previous) {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}