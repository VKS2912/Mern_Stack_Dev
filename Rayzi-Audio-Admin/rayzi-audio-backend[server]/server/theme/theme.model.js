const mongoose = require("mongoose");

const themeSchema = new mongoose.Schema(
  {
    theme: String,
    type: { type: Number, enum: [0, 1], default: 0 },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Theme", themeSchema);
