const mongoose = require("mongoose");

const levelSchema = new mongoose.Schema(
  {
    name: String,
    coin: Number,
    image: String,
    accessibleFunction:{
      liveStreaming:{type:Boolean,default:true},
      freeCall:{type:Boolean,default:true},
      cashOut:{type:Boolean,default:true},
      uploadPost:{type:Boolean,default:true},
      uploadVideo:{type:Boolean,default:true},
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = mongoose.model("Level", levelSchema);
