const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema(
  {
    video: String,
    hashtag: Array,
    mentionPeople: Array,
    caption: String,
    location: String,
    thumbnail: String,
    screenshot: String,
    isOriginalAudio: { type: Boolean, default: false },
    like: { type: Number, default: 0 },
    comment: { type: Number, default: 0 },
    allowComment: { type: Boolean, default: true },
    showVideo: { type: Number, enum: [0, 1], default: 0 }, // 0:public, 1:followers
    song: { type: mongoose.Schema.Types.ObjectId, ref: "Song" },
    duration: { type: Number, default: 0 },
    size: { type: String, default: "0" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isDelete: { type: Boolean, default: false },
    isFake: { type: Boolean, default: false },
    fakeVideoType:{type:Number , enum: [0, 1], default: null}, // 0 :link 1 :file
    date: String,
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

module.exports = mongoose.model("Video", videoSchema);
