const mongoose = require("mongoose");

const historySchema = new mongoose.Schema(
  {
    player1: {
      type: String,
      required: true,
      maxlength: 20,
    },
    player2: {
      type: String,
      required: true,
      maxlength: 20,
    },
    typeGame: {
      type: String,
      required: true,
    },
    winner: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "history" }
);

module.exports = mongoose.model("History", historySchema);
