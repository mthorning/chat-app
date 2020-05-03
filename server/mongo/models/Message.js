const mongoose = require("mongoose");

messageSchema = new mongoose.Schema(
  {
    id: String,
    message: String,
    timestamp: Number,
    displayName: String,
  },
  { capped: { max: 250 } }
);

module.exports = mongoose.model("messages", messageSchema);
