const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    fullName: { 
      type: String, 
      required: true,
      trim: true
    },
    email: { 
      type: String, 
      required: true, 
      unique: true,
      lowercase: true,
      trim: true
    },
    password: { 
      type: String, 
      required: true,
      minlength: 6
    },
    profileImageUrl: { 
      type: String, 
      default: "" 
    },
    currency: {
      type: String,
      default: "USD"
    },
    monthlyBudget: {
      type: Number,
      default: 0
    },
    // Card integration
    cards: [{
      cardType: {
        type: String,
        enum: ["debit", "credit"],
        required: true
      },
      cardName: {
        type: String,
        required: true,
        trim: true
      },
      lastFourDigits: {
        type: String,
        required: true,
        maxlength: 4
      },
      bankName: {
        type: String,
        required: true
      },
      creditLimit: {
        type: Number,
        default: 0 // Only for credit cards
      },
      currentBalance: {
        type: Number,
        default: 0
      },
      isActive: {
        type: Boolean,
        default: true
      }
    }]
  }, 
  { 
    timestamps: true 
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);