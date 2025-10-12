const mongoose = require("mongoose");

const incomeSchema = new mongoose.Schema(
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
        "Salary",
        "Freelance",
        "Business",
        "Investment",
        "Gift",
        "Rental",
        "Bonus",
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
    source: {
      type: String,
      trim: true,
    },
    isRecurring: {
      type: Boolean,
      default: false
    },
    recurringType: {
      type: String,
      enum: ["Monthly", "Weekly", "Yearly", null],
      default: null
    }
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
incomeSchema.index({ user: 1, date: -1 });
incomeSchema.index({ user: 1, category: 1 });

module.exports = mongoose.model("Income", incomeSchema);