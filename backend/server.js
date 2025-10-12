require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/v1/auth", require("./routes/authRoutes"));
app.use("/api/v1/expenses", require("./routes/expenseRoutes"));
app.use("/api/v1/incomes", require("./routes/incomeRoutes"));
app.use("/api/v1/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/v1/cards", require("./routes/cardRoutes")); // Add this line

// Basic route
app.get("/", (req, res) => {
  res.json({ 
    message: "Expense Tracker API is running!",
    version: "1.0.0",
    endpoints: {
      auth: "/api/v1/auth",
      expenses: "/api/v1/expenses",
      incomes: "/api/v1/incomes",
      dashboard: "/api/v1/dashboard",
      cards: "/api/v1/cards" // Add this
    }
  });
});

// Handle undefined routes
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));