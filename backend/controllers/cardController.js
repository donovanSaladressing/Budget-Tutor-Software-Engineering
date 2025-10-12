const User = require("../models/User");

// @desc    Add a new card
// @route   POST /api/v1/cards
// @access  Private
exports.addCard = async (req, res) => {
  try {
    const { cardType, cardName, lastFourDigits, bankName, creditLimit } = req.body;

    // Validate card data
    if (!cardType || !cardName || !lastFourDigits || !bankName) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required card details"
      });
    }

    if (!["debit", "credit"].includes(cardType)) {
      return res.status(400).json({
        success: false,
        message: "Card type must be either 'debit' or 'credit'"
      });
    }

    const user = await User.findById(req.user.id);
    
    // Check if card already exists
    const cardExists = user.cards.some(
      card => card.lastFourDigits === lastFourDigits && card.cardType === cardType
    );

    if (cardExists) {
      return res.status(400).json({
        success: false,
        message: "Card with these details already exists"
      });
    }

    const newCard = {
      cardType,
      cardName,
      lastFourDigits,
      bankName,
      creditLimit: cardType === "credit" ? creditLimit || 0 : 0,
      currentBalance: 0
    };

    user.cards.push(newCard);
    await user.save();

    res.status(201).json({
      success: true,
      message: "Card added successfully",
      data: newCard
    });
  } catch (error) {
    console.error("Add card error:", error);
    res.status(500).json({
      success: false,
      message: "Error adding card",
      error: error.message
    });
  }
};

// @desc    Get all user cards
// @route   GET /api/v1/cards
// @access  Private
exports.getUserCards = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("cards");
    
    res.json({
      success: true,
      data: user.cards
    });
  } catch (error) {
    console.error("Get cards error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching cards",
      error: error.message
    });
  }
};

// @desc    Update card details
// @route   PUT /api/v1/cards/:cardId
// @access  Private
exports.updateCard = async (req, res) => {
  try {
    const { cardName, bankName, creditLimit, isActive } = req.body;
    const { cardId } = req.params;

    const user = await User.findById(req.user.id);
    const card = user.cards.id(cardId);

    if (!card) {
      return res.status(404).json({
        success: false,
        message: "Card not found"
      });
    }

    if (cardName) card.cardName = cardName;
    if (bankName) card.bankName = bankName;
    if (creditLimit !== undefined && card.cardType === "credit") {
      card.creditLimit = creditLimit;
    }
    if (isActive !== undefined) card.isActive = isActive;

    await user.save();

    res.json({
      success: true,
      message: "Card updated successfully",
      data: card
    });
  } catch (error) {
    console.error("Update card error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating card",
      error: error.message
    });
  }
};

// @desc    Delete a card
// @route   DELETE /api/v1/cards/:cardId
// @access  Private
exports.deleteCard = async (req, res) => {
  try {
    const { cardId } = req.params;

    const user = await User.findById(req.user.id);
    user.cards.pull(cardId);
    await user.save();

    res.json({
      success: true,
      message: "Card deleted successfully"
    });
  } catch (error) {
    console.error("Delete card error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting card",
      error: error.message
    });
  }
};

// @desc    Get card spending summary
// @route   GET /api/v1/cards/summary
// @access  Private
exports.getCardSummary = async (req, res) => {
  try {
    const Expense = require("../models/Expense");
    const user = await User.findById(req.user.id).select("cards");
    
    const cardSummaries = await Promise.all(
      user.cards.map(async (card) => {
        const cardExpenses = await Expense.aggregate([
          {
            $match: {
              user: req.user._id,
              "cardUsed.lastFourDigits": card.lastFourDigits,
              "cardUsed.cardType": card.cardType
            }
          },
          {
            $group: {
              _id: null,
              totalSpent: { $sum: "$amount" },
              transactionCount: { $sum: 1 }
            }
          }
        ]);

        return {
          cardId: card._id,
          cardName: card.cardName,
          cardType: card.cardType,
          lastFourDigits: card.lastFourDigits,
          bankName: card.bankName,
          creditLimit: card.creditLimit,
          currentBalance: card.currentBalance,
          totalSpent: cardExpenses[0]?.totalSpent || 0,
          transactionCount: cardExpenses[0]?.transactionCount || 0,
          availableCredit: card.cardType === "credit" ? 
            card.creditLimit - (cardExpenses[0]?.totalSpent || 0) : null
        };
      })
    );

    res.json({
      success: true,
      data: cardSummaries
    });
  } catch (error) {
    console.error("Card summary error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching card summary",
      error: error.message
    });
  }
};
