const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, default: "" },
    username: { type: String, default: "" },
    gender: { type: String, default: "" },
    age: { type: Number, default: 0 },
    email: String,
    image: { type: String, default: "" },
    country: String,
    ip: String,
    identity: String,
    referralCode: String,
    lastLogin: String,
    fcmToken: String,
    analyticDate: String,

    isOnline: { type: Boolean, default: false },
    isBusy: { type: Boolean, default: false },
    isFake: { type: Boolean, default: false },
    link: { type: String, default: null },
    token: { type: String, default: null },
    channel: { type: String, default: null },

    isBlock: { type: Boolean, default: false },

    isReferral: { type: Boolean, default: false },
    referralCount: { type: Number, default: 0 },

    bio: { type: String, default: null },

    followers: { type: Number, default: 0 },
    following: { type: Number, default: 0 },

    linkType: { type: Number, default: 0 }, //0 : Link ,1 :file
    imageType: { type: Number, default: 0 }, //0 : Link ,1 :file

    video: { type: Number, default: 0 },
    post: { type: Number, default: 0 },

    level: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Level",
      default: null,
    },
    uniqueId: Number,
    diamond: { type: Number, default: 0 },
    rCoin: { type: Number, default: 0 },
    withdrawalRcoin: { type: Number, default: 0 },
    spentCoin: { type: Number, default: 0 },

    loginType: { type: Number, enum: [0, 1, 2], default: 0 }, //0 : google , 1 : facebook , 2 : quick
    notification: {
      newFollow: { type: Boolean, default: true },
      favoriteLive: { type: Boolean, default: true },
      likeCommentShare: { type: Boolean, default: true },
      message: { type: Boolean, default: true },
    },

    isVIP: { type: Boolean, default: false },
    plan: {
      planStartDate: { type: String, default: null }, // VIP plan start date
      planId: { type: mongoose.Schema.Types.ObjectId, default: null },
    },

    ad: {
      count: { type: Number, default: 0 },
      date: { type: String, default: null },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("User", userSchema);
