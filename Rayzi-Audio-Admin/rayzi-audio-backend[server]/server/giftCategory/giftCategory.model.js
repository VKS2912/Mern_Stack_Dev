const mongoose = require("mongoose");

const giftCategorySchema = new mongoose.Schema(
  {
    name: String,
    image: String,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("GiftCategory", giftCategorySchema);
