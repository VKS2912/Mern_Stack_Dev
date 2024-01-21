const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema(
  {
    countryName: String,
    states: Array
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Location", locationSchema);
