const mongoose = require("mongoose");

const songSchema = new mongoose.Schema(
  {
    image: String,
    title: String,
    singer: String,
    song: String,
    isDelete: { type: Boolean, default: false }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Song", songSchema);
