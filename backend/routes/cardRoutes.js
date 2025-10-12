const express = require("express");
const {
  addCard,
  getUserCards,
  updateCard,
  deleteCard,
  getCardSummary
} = require("../controllers/cardController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// All routes are protected
router.use(protect);

router.route("/")
  .get(getUserCards)
  .post(addCard);

router.route("/summary")
  .get(getCardSummary);

router.route("/:cardId")
  .put(updateCard)
  .delete(deleteCard);

module.exports = router;