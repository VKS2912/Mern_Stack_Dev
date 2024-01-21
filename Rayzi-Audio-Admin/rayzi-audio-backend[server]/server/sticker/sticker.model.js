const mongoose = require("mongoose");

const stickerSchema = new mongoose.Schema(
  {
    sticker: String
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Sticker", stickerSchema);
