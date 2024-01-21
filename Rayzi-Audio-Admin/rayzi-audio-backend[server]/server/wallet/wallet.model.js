const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    type: { type: Number, enum: [0, 1, 2, 3, 4, 5, 6, 7, 8] }, // 0:gift, 1:convert, 2:purchase [diamond purchase], 3:call, 4:ad[from watching ad], 5:login bonus, 6:referral bonus, 7: cashOut, 8: admin [admin add or less the rCoin or diamond through admin panel]
    diamond: { type: Number, default: null },
    rCoin: { type: Number, default: null },
    otherUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    date: String,
    isIncome: { type: Boolean, default: true },
    // coin plan id
    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CoinPlan",
      default: null,
    },
    paymentGateway: { type: String, default: null },
    // this field for call
    callConnect: { type: Boolean, default: false },
    callStartTime: { type: String, default: null },
    callEndTime: { type: String, default: null },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

module.exports = mongoose.model("Wallet", walletSchema);
