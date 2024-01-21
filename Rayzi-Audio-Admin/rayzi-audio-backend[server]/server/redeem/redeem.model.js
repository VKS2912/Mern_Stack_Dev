const mongoose = require("mongoose");

const redeemSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    paymentGateway: String,
    description: String,
    rCoin: Number,
    status: { type: Number, default: 0, enum: [0, 1, 2] }, // 0: pending, 1: accepted, 2: decline
    date: String,

  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Redeem", redeemSchema);
