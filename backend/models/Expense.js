const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Please add a title"],
      trim: true,
      maxlength: 100,
    },
    amount: {
      type: Number,
      required: [true, "Please add an amount"],
      min: 0,
    },
    category: {
      type: String,
      required: [true, "Please select a category"],
      enum: [
        "Food & Dining",
        "Transportation",
        "Entertainment",
        "Healthcare",
        "Shopping",
        "Bills & Utilities",
        "Education",
        "Travel",
        "Personal Care",
        "Other"
      ],
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    paymentMethod: {
      type: String,
      enum: ["Cash", "Credit Card", "Debit Card", "Digital Wallet", "Bank Transfer"],
      default: "Cash"
    },
    // Card reference for tracking
    cardUsed: {
      cardType: String,
      cardName: String,
      lastFourDigits: String
    },
    isRecurring: {
      type: Boolean,
      default: false
    },
    recurringType: {
      type: String,
      enum: ["Daily", "Weekly", "Monthly", "Yearly", null],
      default: null
    }
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
expenseSchema.index({ user: 1, date: -1 });
expenseSchema.index({ user: 1, category: 1 });
expenseSchema.index({ user: 1, paymentMethod: 1 });

module.exports = mongoose.model("Expense", expenseSchema);