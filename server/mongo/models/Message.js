const mongoose = require("mongoose");

messageSchema = new mongoose.Schema(
  {
    id: String,
    message: String,
    timestamp: Number,
    displayName: String,
    img: Boolean,
    imgId: String,
  },
  { capped: { max: 100000 } }
);

module.exports = mongoose.model("messages", messageSchema);
