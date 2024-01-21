const mongoose = require("mongoose");

const giftSchema = new mongoose.Schema(
  {
    image: String,
    coin: Number,
    type: { type: Number, enum: [0, 1], default: 0 }, //0 : image , 1 : gif 
    category: { type: mongoose.Schema.Types.ObjectId, ref: "GiftCategory" },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Gift", giftSchema);
