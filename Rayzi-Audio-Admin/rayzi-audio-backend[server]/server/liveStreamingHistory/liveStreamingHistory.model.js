const mongoose = require("mongoose");

const liveStreamingHistorySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    duration: { type: String, default: "00:00:00" },
    user: { type: Number, default: 0 }, // how many user joined the live streaming [user count]
    gifts: { type: Number, default: 0 }, // how many gifts user received
    comments: { type: Number, default: 0 },
    fans: { type: Number, default: 0 }, // how many followers increased during live streaming
    rCoin: { type: Number, default: 0 }, // how many rCoin live user earned
    startTime: String,
    endTime: String,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model(
  "LiveStreamingHistory",
  liveStreamingHistorySchema
);
