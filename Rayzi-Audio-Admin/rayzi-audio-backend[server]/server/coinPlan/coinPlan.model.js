const mongoose = require("mongoose");

const coinPlanSchema = new mongoose.Schema(
  {
    diamonds: Number,
    dollar: Number,
    rupee: Number,
    tag: String,
    productKey: String,
    isDelete: { type: Boolean, default: false }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("CoinPlan", coinPlanSchema);
