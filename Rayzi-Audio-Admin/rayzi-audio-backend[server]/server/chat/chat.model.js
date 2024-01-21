const mongoose = require("mongoose");

const chatSchema = mongoose.Schema(
  {
    senderId: String,
    messageType: String,
    message: String,
    image: String,
    topic: { type: mongoose.Schema.Types.ObjectId, ref: "ChatTopic" },
    date: String,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Chat", chatSchema);
