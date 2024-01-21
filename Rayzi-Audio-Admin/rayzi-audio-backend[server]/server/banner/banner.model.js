const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema(
  {
    image: String,
    URL: String,
    isVIP: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Banner", bannerSchema);
