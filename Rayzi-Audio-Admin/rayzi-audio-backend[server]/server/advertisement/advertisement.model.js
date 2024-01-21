const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const advertisementSchema = new Schema(
  {
    native: String,
    reward: String,
    interstitial: String,
    banner: String,
    show: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = mongoose.model("Advertisement", advertisementSchema);
