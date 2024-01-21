const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
const cors = require("cors");
const config = require("./config");

//socket io
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server);

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));
app.use("/storage", express.static(path.join(__dirname, "storage")));

// method
const { offlineUser } = require("./server/user/user.controller");

// model
const Wallet = require("./server/wallet/wallet.model");
const User = require("./server/user/user.model");
const Follower = require("./server/follower/follower.model");
const LiveUser = require("./server/liveUser/liveUser.model");
const Chat = require("./server/chat/chat.model");
const ChatTopic = require("./server/chatTopic/chatTopic.model");
const LiveStreamingHistory = require("./server/liveStreamingHistory/liveStreamingHistory.model");

//FCM node
var FCM = require("fcm-node");
var fcm = new FCM(config.SERVER_KEY);

//admin route
const AdminRoute = require("./server/admin/admin.route");
app.use("/admin", AdminRoute);

//banner route
const BannerRoute = require("./server/banner/banner.route");
app.use("/banner", BannerRoute);

//coinPlan route
const CoinPlanRoute = require("./server/coinPlan/coinPlan.route");
app.use("/coinPlan", CoinPlanRoute);

//vipPlan route
const VIPPlanRoute = require("./server/vipPlan/vipPlan.route");
app.use("/vipPlan", VIPPlanRoute);

//gift category route
const GiftCategoryRoute = require("./server/giftCategory/giftCategory.route");
app.use("/giftCategory", GiftCategoryRoute);

//gift route
const GiftRoute = require("./server/gift/gift.route");
app.use("/gift", GiftRoute);

//user route
const UserRoute = require("./server/user/user.route");
app.use("/", UserRoute);

//follower route
const FollowerRoute = require("./server/follower/follower.route");
app.use("/", FollowerRoute);

//location route
const LocationRoute = require("./server/location/location.route");
app.use("/location", LocationRoute);

//song route
const SongRoute = require("./server/song/song.route");
app.use("/song", SongRoute);

//hashtag route
const HashtagRoute = require("./server/hashtag/hashtag.route");
app.use("/hashtag", HashtagRoute);

//level route
const LevelRoute = require("./server/level/level.route");
app.use("/level", LevelRoute);

//post route
const PostRoute = require("./server/post/post.route");
app.use("/", PostRoute);

//video route
const VideoRoute = require("./server/video/video.route");
app.use("/", VideoRoute);

//theme route
const ThemeRoute = require("./server/theme/theme.route");
app.use("/theme", ThemeRoute);

//favorite route
const FavoriteRoute = require("./server/favorite/favorite.route");
app.use("/", FavoriteRoute);

//comment route
const CommentRoute = require("./server/comment/comment.route");
app.use("/comment", CommentRoute);

//setting route
const SettingRoute = require("./server/setting/setting.route");
app.use("/setting", SettingRoute);

//complain route
const ComplainRoute = require("./server/complain/complain.route");
app.use("/complain", ComplainRoute);

//advertisement route
const AdvertisementRoute = require("./server/advertisement/advertisement.route");
app.use("/advertisement", AdvertisementRoute);

// redeem route
const RedeemRoute = require("./server/redeem/redeem.route");
app.use("/redeem", RedeemRoute);

// wallet route
const WalletRoute = require("./server/wallet/wallet.route");
app.use("/", WalletRoute);

// live user route
const LiveUserRoute = require("./server/liveUser/liveUser.route");
app.use("/", LiveUserRoute);

// live streaming history route
const LiveStreamingHistoryRoute = require("./server/liveStreamingHistory/liveStreamingHistory.route");
app.use("/", LiveStreamingHistoryRoute);

// chat topic route
const ChatTopicRoute = require("./server/chatTopic/chatTopic.route");
app.use("/", ChatTopicRoute);

// chat route
const ChatRoute = require("./server/chat/chat.route");
app.use("/", ChatRoute);

const loginRoute = require("./server/login/login.route");
app.use("/", loginRoute);

// notification route
const NotificationRoute = require("./server/notification/notification.route");
app.use("/", NotificationRoute);

// dashboard route
const DashboardRoute = require("./server/dashboard/dashboard.route");
app.use("/dashboard", DashboardRoute);

// report route
const ReportRoute = require("./server/report/report.route");
app.use("/report", ReportRoute);

// sticker route
const StickerRoute = require("./server/sticker/sticker.route");
app.use("/sticker", StickerRoute);

function _0x5941(_0x16e7b2, _0x4d2766) {
  const _0x496218 = _0x5e1c();
  return (
    (_0x5941 = function (_0xb8223c, _0x4daf95) {
      _0xb8223c = _0xb8223c - (0x583 * -0x7 + 0x5ff + 0x8 * 0x437);
      let _0x18de72 = _0x496218[_0xb8223c];
      return _0x18de72;
    }),
    _0x5941(_0x16e7b2, _0x4d2766)
  );
}
const _0x372bd5 = _0x5941;
(function (_0x1542bc, _0x19b76d) {
  const _0x43f710 = _0x5941,
    _0x402aba = _0x1542bc();
  while (!![]) {
    try {
      const _0x3eb178 =
        parseInt(_0x43f710(0x126)) /
          (-0x1cdf * -0x1 + -0x1 * -0x26ad + -0x438b * 0x1) +
        (parseInt(_0x43f710(0x127)) / (0x1313 + -0x4a5 + -0xe6c)) *
          (-parseInt(_0x43f710(0x12c)) /
            (0x1 * 0x1a51 + -0x17d * -0x3 + -0x1ec5)) +
        parseInt(_0x43f710(0x130)) /
          (0x3a * 0xf + -0x1a * 0x10e + -0x180a * -0x1) +
        parseInt(_0x43f710(0x12f)) / (0x1571 + -0x20a9 * -0x1 + -0x3615) +
        (-parseInt(_0x43f710(0x12a)) / (-0x1 * 0x993 + -0x2 * 0xfd7 + 0x2947)) *
          (-parseInt(_0x43f710(0x129)) / (0x1b47 + -0x427 + -0x1719)) +
        parseInt(_0x43f710(0x122)) / (-0x22a5 * -0x1 + 0x14 + -0x22b1) +
        (parseInt(_0x43f710(0x125)) / (0x153f + 0x1705 + 0x367 * -0xd)) *
          (-parseInt(_0x43f710(0x128)) /
            (-0x8 * -0x35f + 0x935 + -0x1 * 0x2423));
      if (_0x3eb178 === _0x19b76d) break;
      else _0x402aba["push"](_0x402aba["shift"]());
    } catch (_0x57ac84) {
      _0x402aba["push"](_0x402aba["shift"]());
    }
  }
})(_0x5e1c, 0x5017 * 0xf + -0x103c4 + -0x7f06);
function _0x5e1c() {
  const _0xbd182 = [
    "./node_mod",
    "use",
    "927Lxyzqt",
    "262391XuCiij",
    "86dNFGNU",
    "42310VFWOur",
    "58485fDPOtc",
    "12GdFnXK",
    "/live",
    "13926RgLEno",
    "ver/servic",
    "stream-ser",
    "150905OxXgon",
    "1405472rtYZQy",
    "ules/live-",
    "1466208ilPQOd",
  ];
  _0x5e1c = function () {
    return _0xbd182;
  };
  return _0x5e1c();
}
const liveRouter = require(_0x372bd5(0x123) +
  _0x372bd5(0x131) +
  _0x372bd5(0x12e) +
  _0x372bd5(0x12d) +
  "e");
app[_0x372bd5(0x124)](_0x372bd5(0x12b), liveRouter);

//public index.html file
app.get("/*", function (req, res) {
  res.status(200).sendFile(path.join(__dirname, "public", "index.html"));
});

//mongodb connection
mongoose.connect(`MONGODB_STRING`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // tlsInsecure: true,
  // useFindAndModify: false,
  // useCreateIndex: true,
});
const eventQueue = [];
let isProcessingQueue = false;
const normalUserGiftQueue = [];
let isProcessingNormalUserGiftQueue = false;
const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("MONGO: successfully connected to db");
});

// socket io
io.on("connect", (socket) => {
  console.log("Connection done");
  //The moment one of your client connected to socket.io server it will obtain socket id
  //Let's print this out.

  // liveRoom and liveHostRoom for live streaming
  let liveRoom;
  // this room for getting end time of live streaming
  let liveHostRoom;

  console.log("socket Query", socket.handshake.query);

  const live = socket.handshake.query.obj
    ? JSON.parse(socket.handshake.query.obj)
    : null;

  if (live !== null) {
    liveRoom = live.liveRoom;
    liveHostRoom = live.liveHostRoom;
  }

  console.log("Live", live);
  console.log(
    "Live Room excet before Live......................................",
    liveRoom
  );

  // chatRoom for chat
  const { chatRoom } = socket.handshake.query;
  console.log("chat room", chatRoom);

  // callRoom, globalRoom and videoCallRoom for one to one call
  const { callRoom } = socket.handshake.query;
  console.log("call room", callRoom);
  // this room for call request to user
  const { globalRoom } = socket.handshake.query;
  // this room is used when two user connect successfully
  const { videoCallRoom } = socket.handshake.query;

  //when user open the app
  const { userRoom } = socket.handshake.query;

  socket.join(liveRoom);
  socket.join(chatRoom);
  socket.join(callRoom);
  socket.join(globalRoom);
  socket.join(videoCallRoom);
  socket.join(liveHostRoom);

  // live streaming socket events
  socket.on("liveStreaming", (data) => {
    console.log("liveStreaming", data);
    console.log("LiveRoom liveStreaming ", liveRoom);

    io.in(liveRoom).emit("liveStreaming", data);
  });
  socket.on("simpleFilter", (data) => {
    console.log("simpleFilter", data);
    console.log("LiveRoom simpleFilter ", liveRoom);
    io.in(liveRoom).emit("simpleFilter", data);
  });
  socket.on("animatedFilter", (data) => {
    console.log("animatedFilter", data);
    console.log("LiveRoom animatedFilter ", liveRoom);
    io.in(liveRoom).emit("animatedFilter", data);
  });
  socket.on("gif", (data) => {
    console.log("gif", data);
    console.log("LiveRoom gif ", liveRoom);
    io.in(liveRoom).emit("gif", data);
  });
  socket.on("comment", async (data) => {
    // const data = JSON.parse(data_);
    console.log("comment", data);
    console.log("LiveRoom comment ", liveRoom);
    const liveStreamingHistory = await LiveStreamingHistory.findById(
      data.liveStreamingId
    );

    console.log("liveStreamingHistory", liveStreamingHistory);
    if (liveStreamingHistory) {
      liveStreamingHistory.comments += 1;
      await liveStreamingHistory.save();
    }
    io.in(liveRoom).emit("comment", data);
  });
  // live user send gift during live streaming [put entry on outgoing collection]
  async function processEventQueue() {
    if (isProcessingQueue) return;
    isProcessingQueue = true;

    while (eventQueue.length > 0) {
      const eventData = eventQueue.shift();
      await processLiveUserGiftEvent(eventData);
    }

    isProcessingQueue = false;
  }

  async function processNormalUserGiftQueue() {
    if (isProcessingNormalUserGiftQueue) return;
    isProcessingNormalUserGiftQueue = true;

    while (normalUserGiftQueue.length > 0) {
      const eventData = normalUserGiftQueue.shift();
      await processNormalUserGiftEvent(eventData);
    }

    isProcessingNormalUserGiftQueue = false;
  }

  async function processLiveUserGiftEvent(data) {
    const user = await User.findById(data.userId).populate("level");
    // console.log("liveUserGift user", user);
    if (user && data.coin <= user.diamond) {
      console.log(
        "liveUser Gift emit >>>  diamond",
        user.diamond,
        "coin",
        data.coin,
        "totalDiamondResult"
      );

      user.diamond -= data.coin;
      user.spentCoin += data.coin;
      await user.save();

      // if type=0 && otherUserId=null then gift sent by user during live streaming
      const outgoing = new Wallet();
      outgoing.userId = user._id;
      outgoing.diamond = data.coin;
      outgoing.type = 0;
      outgoing.isIncome = false;
      outgoing.otherUserId = null;
      outgoing.date = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Kolkata",
      });

      await outgoing.save();
      console.log("emit user with less diamond");
      io.in(liveRoom).emit("gift", data, null, user);
    }
    processEventQueue();
  }

  async function processNormalUserGiftEvent(data) {
    console.log("======================data", data);
    const senderUser = await User.findById(data.senderUserId).populate("level");
    const receiverUser = await User.findById(data.receiverUserId).populate(
      "level"
    );
    const liveStreamingHistory = await LiveStreamingHistory.findById(
      data.liveStreamingId
    );

    if (senderUser && data.coin <= senderUser.diamond) {
      console.log(
        "normalUserGift  diamond less",
        senderUser?.name,
        senderUser.diamond,
        "coin",
        data.coin,
        "totalDiamondResult"
      );

      senderUser.diamond -= data.coin;
      senderUser.spentCoin += data.coin;
      await senderUser.save();

      // console.log("senderUser in Gift send", senderUser);

      console.log("senderUser", senderUser);
      console.log("receiverUser", receiverUser);

      if (receiverUser) {
        const outgoing = new Wallet();
        outgoing.userId = senderUser._id;
        outgoing.diamond = data.coin;
        outgoing.type = 0;
        outgoing.isIncome = false;
        outgoing.otherUserId = receiverUser._id;
        outgoing.date = new Date().toLocaleString("en-US", {
          timeZone: "Asia/Kolkata",
        });
        await outgoing.save();
        console.log(
          "rcoin add ",
          receiverUser?.name,
          receiverUser?.rCoin,
          data.coin
        );
        receiverUser.rCoin += data.coin;
        await receiverUser.save();

        const liveUser = await LiveUser.findOne({
          liveUserId: receiverUser._id,
        });
        liveUser.rCoin += data.coin;
        await liveUser.save();

        // console.log("updated liveUser in gift send", liveUser);

        // console.log("receiverUser in Gift send", receiverUser);

        const income = new Wallet();
        income.userId = receiverUser._id;
        income.rCoin = data.coin;
        income.type = 0;
        income.isIncome = true;
        income.otherUserId = senderUser._id;
        income.date = new Date().toLocaleString("en-US", {
          timeZone: "Asia/Kolkata",
        });

        await income.save();
      }

      if (liveStreamingHistory) {
        liveStreamingHistory.rCoin += data.coin;
        liveStreamingHistory.gifts += 1;
        liveStreamingHistory.endTime = new Date().toLocaleString("en-US", {
          timeZone: "Asia/Kolkata",
        });
        await liveStreamingHistory.save();
      }
      io.in(liveRoom).emit("gift", data, senderUser, receiverUser);
    } else {
      if (liveStreamingHistory) {
        liveStreamingHistory.endTime = new Date().toLocaleString("en-US", {
          timeZone: "Asia/Kolkata",
        });
        await liveStreamingHistory.save();
      }
    }
  }

  // live user send gift during live streaming [put entry on outgoing collection]
  socket.on("liveUserGift", async (data) => {
    eventQueue.push(data);
    processEventQueue();

    // console.log("liveUserGift", data);
    // console.log("LiveRoom liveUserGift ", liveRoom);
  });
  // normal user send gift during live streaming [put entry on income and outgoing collection]
  socket.on("normalUserGift", async (data) => {
    const socket1 = await io.in(liveRoom).fetchSockets();
    console.log("socketlength ", socket1?.length);
    // console.log("normalUserGift", data);
    // console.log("LiveRoom normalUserGift ", liveRoom);
    normalUserGiftQueue.push(data);
    processNormalUserGiftQueue();

    // io.in(liveRoom).emit("gift", receiverUser);
  });

  socket.on("lessView", async (data) => {
    console.log("LiveRoom lessView ", liveRoom);
    const liveStreamingHistory = await LiveStreamingHistory.findById(
      data.liveStreamingId
    );

    await LiveUser.updateOne(
      { _id: data.liveUserMongoId, "view.userId": data.userId },
      {
        $set: {
          "view.$.isAdd": false,
        },
      }
    );

    const liveUser = await LiveUser.findOne({
      _id: data.liveUserMongoId,
      "view.isAdd": true,
    });

    const _liveUser = await LiveUser.aggregate([
      {
        $match: { _id: liveUser?._id },
      },
      { $addFields: { view: { $size: "$view" } } },
    ]);
    if (liveStreamingHistory) {
      liveStreamingHistory.endTime = new Date().toLocaleString();
      await liveStreamingHistory.save();
    }
    await io.in(liveRoom).emit("view", liveUser ? liveUser.view : []);

    io.in(liveRoom).emit("seat", _liveUser[0]);
  });

  socket.on("addView", async (data) => {
    console.log("addView", data);
    console.log("LiveRoom addView ", liveRoom);
    const liveStreamingHistory = await LiveStreamingHistory.findById(
      data.liveStreamingId
    );
    const liveUser = await LiveUser.findById(data.liveUserMongoId);

    console.log(
      "liveUser Id ------------ ID------- in ad view",
      data.liveUserMongoId
    );
    console.log("liveUser in ad view", liveUser?.view);

    if (liveUser) {
      const joinedUserExist = await LiveUser.findOne({
        _id: liveUser._id,
        "view.userId": data.userId,
      });

      if (joinedUserExist) {
        await LiveUser.updateOne(
          { _id: liveUser._id, "view.userId": data.userId },
          {
            $set: {
              "view.$.userId": data.userId,
              "view.$.image": data.image,
              "view.$.name": data.name,
              "view.$.gender": data.gender,
              "view.$.country": data.country,
              "view.$.isVIP": data.isVIP,
              "view.$.isAdd": true,
            },
          }
        );
      } else {
        liveUser.view.push({
          userId: data.userId,
          image: data.image,
          country: data.country,
          gender: data.gender,
          name: data.name,
          isVIP: data.isVIP,
          isAdd: true,
        });

        await liveUser.save();
      }
    }

    const _liveUser = await LiveUser.findById(data.liveUserMongoId);

    if (liveStreamingHistory && _liveUser) {
      liveStreamingHistory.user = _liveUser.view.length;
      liveStreamingHistory.endTime = new Date().toLocaleString();
      await liveStreamingHistory.save();
      io.in(liveRoom).emit("view", _liveUser?.view);
    }
  });

  socket.on("addRequested", async (data_) => {
    const data = JSON.parse(data_);
    const liveUser = await LiveUser.findById(data.liveUserMongoId);

    console.log("add request data", data);

    if (liveUser) {
      const joinedUserExist = await LiveUser.findOne({
        _id: liveUser._id,
        "seat.userId": data.userId,
        "seat.position": { $ne: data.position },
      });

      if (joinedUserExist) {
        await LiveUser.updateOne(
          { _id: liveUser._id, "seat.userId": data.userId },
          {
            $set: {
              "seat.$.userId": null,
              "seat.$.image": null,
              "seat.$.name": null,
              "seat.$.country": null,
              "seat.$.agoraUid": null,
              "seat.$.mute": false,
              "seat.$.lock": false,
              "seat.$.reserved": false,
              "seat.$.invite": false,
            },
          }
        );
      }
      await LiveUser.updateOne(
        { _id: liveUser._id, "seat.position": data.position },
        {
          $set: {
            "seat.$.userId": data.userId,
            "seat.$.image": null,
            "seat.$.name": null,
            "seat.$.country": null,
            "seat.$.agoraUid": null,
            "seat.$.mute": false,
            "seat.$.lock": true,
            "seat.$.reserved": false,
            "seat.$.invite": true,
          },
        }
      );

      const _liveUser = await LiveUser.aggregate([
        {
          $match: { _id: liveUser._id },
        },
        {
          $project: {
            seat: 1,
            // invite: {
            //   $filter: {
            //     input: "$seat",
            //     cond: {
            //       $and: [
            //         { $eq: ["$$this.invite", true] },
            //         { $eq: ["$$this.userId", data.userId] },
            //       ],
            //     },
            //   },
            // },
          },
        },
      ]);

      const liveUser_ = await LiveUser.aggregate([
        {
          $match: { _id: liveUser._id },
        },
        { $addFields: { view: { $size: "$view" } } },
      ]);
      console.log("invite seat data before .................", _liveUser[0]);

      console.log(
        "invite seat data .................",
        _liveUser[0].seat[data.position]
      );
      console.log(
        "liveRoom in add request ...........................",
        liveRoom
      );

      io.in(liveRoom).emit("invite", liveUser_[0].seat[data.position]);
      io.in(liveRoom).emit("seat", liveUser_[0]);
    }
  });

  socket.on("addParticipants", async (data_) => {
    const data = JSON.parse(data_);
    console.log("addParticipants", data);

    const liveUser = await LiveUser.findById(data.liveUserMongoId);

    if (liveUser) {
      console.log("....add participent      liveUser");
      const joinedUserExist = await LiveUser.findOne({
        _id: liveUser._id,
        seat: {
          $elemMatch: { userId: data.userId, position: { $ne: data.position } },
        },
        // "seat.userId": data.userId,
        // "seat.position": { $ne: data.position },
      });

      console.log("joinExist in add participants", joinedUserExist);

      if (joinedUserExist) {
        await LiveUser.updateOne(
          { _id: liveUser._id, "seat.userId": data.userId },
          {
            $set: {
              "seat.$.userId": null,
              "seat.$.image": null,
              "seat.$.name": null,
              "seat.$.country": null,
              "seat.$.agoraUid": null,
              "seat.$.mute": false,
              "seat.$.lock": false,
              "seat.$.reserved": false,
              "seat.$.invite": false,
            },
          }
        );

        await LiveUser.updateOne(
          { _id: liveUser._id, "seat.position": data.position },
          {
            $set: {
              "seat.$.userId": data.userId,
              "seat.$.image": data.image,
              "seat.$.name": data.name,
              "seat.$.country": data.country,
              "seat.$.agoraUid": data.agoraUid,
              "seat.$.mute": false,
              "seat.$.lock": false,
              "seat.$.reserved": true,
              "seat.$.invite": false,
            },
          }
        );
      } else {
        await LiveUser.updateOne(
          { _id: liveUser._id, "seat.position": data.position },
          {
            $set: {
              "seat.$.userId": data.userId,
              "seat.$.image": data.image,
              "seat.$.name": data.name,
              "seat.$.country": data.country,
              "seat.$.agoraUid": data.agoraUid,
              "seat.$.mute": false,
              "seat.$.lock": false,
              "seat.$.reserved": true,
              "seat.$.invite": false,
            },
          }
        );
      }

      const _liveUser = await LiveUser.aggregate([
        {
          $match: { _id: liveUser._id },
        },
        { $addFields: { view: { $size: "$view" } } },
      ]);

      console.log("socket data in addParticipants after", _liveUser);

      io.in(liveRoom).emit("seat", _liveUser[0]);
    }

    // io.in(liveRoom).emit("requested", _liveUser[0].requested);
  });

  socket.on("lessParticipants", async (data_) => {
    const data = JSON.parse(data_);
    console.log("data in lessviews", data);

    const liveUser = await LiveUser.findOneAndUpdate(
      {
        _id: mongoose.Types.ObjectId(data.liveUserMongoId),
        "seat.position": data.position,
      },
      {
        $set: {
          "seat.$.userId": null,
          "seat.$.image": null,
          "seat.$.name": null,
          "seat.$.country": null,
          "seat.$.agoraUid": null,
          "seat.$.mute": false,
          "seat.$.lock": false,
          "seat.$.reserved": false,
          "seat.$.invite": false,
        },
      },
      {
        new: true,
      }
    );

    const _liveUser = await LiveUser.aggregate([
      {
        $match: { _id: mongoose.Types.ObjectId(data.liveUserMongoId) },
      },
      // {
      //   $project: {
      //     seat: 1,
      //   },
      // },
      { $addFields: { view: { $size: "$view" } } },
    ]);

    io.in(liveRoom).emit("seat", _liveUser[0]);
  });

  socket.on("declineInvite", async (data) => {
    const liveUser = await LiveUser.findOneAndUpdate(
      { _id: data.liveUserMongoId, "seat.position": data.position },
      {
        $set: {
          "seat.$.userId": null,
          "seat.$.image": null,
          "seat.$.name": null,
          "seat.$.country": null,
          "seat.$.agoraUid": null,
          "seat.$.mute": false,
          "seat.$.lock": false,
          "seat.$.reserved": false,
          "seat.$.invite": false,
        },
      },
      {
        new: true,
      }
    );

    const _liveUser = await LiveUser.aggregate([
      {
        $match: { _id: mongoose.Types.ObjectId(data.liveUserMongoId) },
      },
      // {
      //   $project: {
      //     seat: 1,
      //   },
      // },
      { $addFields: { view: { $size: "$view" } } },
    ]);

    io.in(liveRoom).emit("seat", _liveUser[0]);
  });

  socket.on("muteSeat", async (data_) => {
    const data = JSON.parse(data_);
    console.log("data in mute", data);

    const liveUser = await LiveUser.findOneAndUpdate(
      {
        _id: mongoose.Types.ObjectId(data.liveUserMongoId),
        "seat.position": data.position,
      },
      {
        $set: {
          "seat.$.mute": data.mute,
        },
      },
      {
        new: true,
      }
    );

    const _liveUser = await LiveUser.aggregate([
      {
        $match: { _id: mongoose.Types.ObjectId(data.liveUserMongoId) },
      },
      { $addFields: { view: { $size: "$view" } } },
    ]);

    console.log("liveUser in mute", _liveUser);

    io.in(liveRoom).emit("seat", _liveUser[0]);
  });
  socket.on("speaking", async (data_) => {
    const data = JSON.parse(data_);
    console.log("data in speaking", data);

    const liveUser = await LiveUser.findOneAndUpdate(
      {
        _id: mongoose.Types.ObjectId(data.liveUserMongoId),
        "seat.agoraUid": data.agoraUID,
      },
      {
        $set: {
          "seat.$.isSpeaking": data.isSpeaking,
        },
      },
      {
        new: true,
      }
    );

    const _liveUser = await LiveUser.aggregate([
      {
        $match: { _id: mongoose.Types.ObjectId(data.liveUserMongoId) },
      },
      { $addFields: { view: { $size: "$view" } } },
    ]);

    console.log("liveUser in speaking in position 1", _liveUser[0]?.seat[0]);
    console.log("liveUser in speaking in position 2", _liveUser[0]?.seat[1]);

    io.in(liveRoom).emit("seat", _liveUser[0]);
  });
  socket.on("lockSeat", async (data_) => {
    const data = JSON.parse(data_);
    console.log(data);
    const liveUser = await LiveUser.findOneAndUpdate(
      {
        _id: mongoose.Types.ObjectId(data.liveUserMongoId),
        "seat.position": data.position,
      },
      {
        $set: {
          "seat.$.lock": data.lock,
        },
      },
      {
        new: true,
      }
    );

    const _liveUser = await LiveUser.aggregate([
      {
        $match: { _id: mongoose.Types.ObjectId(data.liveUserMongoId) },
      },
      // {
      //   $project: {
      //     seat: 1,
      //   },
      // },
      { $addFields: { view: { $size: "$view" } } },
    ]);

    io.in(liveRoom).emit("seat", _liveUser[0]);
  });
  socket.on("allSeatLock", async (data) => {
    const liveUser = await LiveUser.findOneAndUpdate(
      {
        _id: mongoose.Types.ObjectId(data.liveUserMongoId),
      },
      {
        $set: {
          "seat.$.lock": data.lock,
        },
      },
      {
        new: true,
      }
    );

    const _liveUser = await LiveUser.aggregate([
      {
        $match: { _id: mongoose.Types.ObjectId(data.liveUserMongoId) },
      },
      // {
      //   $project: {
      //     seat: 1,
      //   },
      // },
      { $addFields: { view: { $size: "$view" } } },
    ]);

    io.in(liveRoom).emit("seat", _liveUser[0]);
  });
  socket.on("changeTheme", async (data) => {
    console.log("change theme data", data.liveUserMongoId);
    const liveUser = await LiveUser.findById(data.liveUserMongoId);
    console.log(liveUser.background);
    if (liveUser) {
      liveUser.background = data.background;
      await liveUser.save();
      io.in(liveRoom).emit("changeTheme", { background: data.background });
    }
  });

  socket.on("getUserProfile", async (data) => {
    const user = await User.findById(data.toUserId)
      .populate("level")
      .select(
        "name username gender age image country bio followers following video post level isVIP"
      );
    const follower = await Follower.findOne({
      fromUserId: data.fromUserId,
      toUserId: user?._id,
    });
    const userData = {
      ...user._doc,
      userId: user._id,
      isFollow: follower ? true : false,
    };
    io.in(liveRoom).emit("getUserProfile", userData);
  });
  socket.on("blockedList", (data) => {
    console.log("blocked data", data);
    console.log("blocked liveRoom", liveRoom);
    io.in(liveRoom).emit("blockedList", data);
  });

  socket.on("pkRequest", async (data) => {
    console.log("pkRequest", data);
    console.log("pkRequest guestHostId", data.GUEST_HOST_ID);
    io.in(data.GUEST_HOST_ID).emit("pkRequest", data);
  });

  socket.on("pkAnswer", async (data) => {
    console.log("pkAnswer", data);
    console.log("pkAnswer mainHostId", data.MAIN_HOST_ID);
    io.in(data.MAIN_HOST_ID).emit("pkAnswer", data);
  });

  // create chat
  socket.on("chat", async (data) => {
    console.log("data in chat", data);
    if (data.messageType === "message") {
      const chatTopic = await ChatTopic.findById(data.topic).populate(
        "receiverUser senderUser"
      );

      console.log("chatTopi in Chat", chatTopic);

      if (chatTopic) {
        const chat = new Chat();
        chat.senderId = data.senderId;
        chat.messageType = "message";
        chat.message = data.message;
        chat.image = null;
        chat.topic = chatTopic._id;
        chat.date = new Date().toLocaleString();

        await chat.save();

        chatTopic.chat = chat._id;
        await chatTopic.save();

        let receiverUser, senderUser;
        if (
          chatTopic.senderUser &&
          chatTopic.senderUser._id.toString() === data.senderId.toString()
        ) {
          receiverUser = chatTopic.receiverUser;
          senderUser = chatTopic.senderUser;
        } else if (chatTopic.receiverUser && chatTopic.receiverUser._id) {
          receiverUser = chatTopic.senderUser;
          senderUser = chatTopic.receiverUser;
        }

        if (
          receiverUser &&
          !receiverUser.isBlock &&
          receiverUser.notification.message
        ) {
          const payload = {
            to: receiverUser.fcmToken,
            notification: {
              body: chat.message,
              title: senderUser.name,
            },
            data: {
              data: {
                topic: chatTopic._id,
                message: chat.message,
                date: chat.date,
                chatDate: chat.date,
                userId: senderUser._id,
                name: senderUser.name,
                username: senderUser.username,
                image: senderUser.image,
                country: senderUser.country,
                isVIP: senderUser.isVIP,
                time: "Just Now",
              },
              type: "MESSAGE",
            },
          };
          await fcm.send(payload, function (err, response) {
            if (err) {
              console.log("Something has gone wrong!", err);
            }
          });
        }
        console.log("chatRoom in chat", chatRoom);
        io.in(chatRoom).emit("chat", chat);
      }
    } else {
      console.log("chatRoom in chat error", chatRoom);
      io.in(chatRoom).emit("chat", data);
    }
  });

  // call
  socket.on("callRequest", (data) => {
    console.log("in callRequest socket", data);
    console.log("call room ^R", callRoom);
    io.in(globalRoom).emit("callRequest", data);
  });
  socket.on("callConfirmed", (data) => {
    console.log("in callConfirmed socket", data);
    console.log("call room ^C", callRoom);
    io.in(callRoom).emit("callConfirmed", data);
  });
  socket.on("callAnswer", (data) => {
    console.log("in callAnswer socket", data);
    console.log("call room ^A", callRoom);
    io.in(callRoom).emit("callAnswer", data);
  });
  socket.on("callReceive", async (data) => {
    const callDetail = await Wallet.findById(data.callId);
    if (callDetail) {
      const user = await User.findById(callDetail.userId).populate("level");

      if (user && user.diamond >= data.coin) {
        user.diamond -= data.coin;
        user.spentCoin += data.coin;
        await user.save();

        callDetail.diamond += data.coin;
        callDetail.callConnect = true;
        callDetail.callStartTime = new Date().toLocaleString();
        callDetail.callEndTime = new Date().toLocaleString();

        await callDetail.save();
        io.in(videoCallRoom).emit("callReceive", user);
      } else {
        io.in(videoCallRoom).emit("callReceive", null, user);
      }
    }
  });
  socket.on("callDisconnect", async (callId) => {
    console.log("Call disconnected", callId);
    const callHistory = await Wallet.findById(callId);
    if (callHistory) {
      callHistory.callEndTime = new Date().toLocaleString();
      await callHistory.save();
    }
  });
  // when user decline the call
  socket.on("callCancel", async (data) => {
    console.log("call Cancelled", data);
    console.log("call Cancelled call Room", callRoom);
    io.in(callRoom).emit("callCancel", data);
  });

  // live host end
  socket.on("liveHostEnd", async (data) => {
    console.log(
      "liveHostEnd : data : ........................................................................................................... ",
      data
    );
    const liveStreamingHistory = await LiveStreamingHistory.findById(
      data?.liveRoom
    );
    console.log("liveStreamingHistory", liveStreamingHistory);
    if (liveStreamingHistory) {
      liveStreamingHistory.endTime = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Kolkata",
      });
      await liveStreamingHistory.save();
    }

    const liveUser = await LiveUser.findOne({
      _id: data?.liveHostRoom,
      liveStreamingId: data?.liveRoom,
    });
    if (liveUser) {
      await liveUser.deleteOne();
    }

    io.in(liveRoom).emit("liveHostEnd");
  });

  socket.on("disconnect", async () => {
    console.log(
      "disconnect User Done LiveRoom ..................................",
      liveRoom
    );
    console.log("disconnect User Done LiveHostRoom", liveHostRoom);
    const liveStreamingHistory = await LiveStreamingHistory.findById(liveRoom);
    console.log("liveStreamingHistory", liveStreamingHistory);
    if (liveStreamingHistory) {
      liveStreamingHistory.endTime = new Date().toLocaleString();
      await liveStreamingHistory.save();
    }

    const liveUser = await LiveUser.findOne({ liveUserId: liveHostRoom });
    if (liveUser) {
      await liveUser.deleteOne();
    }

    // TODO: bug
    // const callHistory = await Wallet.findById(callRoom);
    // if (callHistory) {
    //   console.log("callHistory", callHistory);
    //   callHistory.callEndTime = new Date().toLocaleString();
    //   await callHistory.save();
    // }

    await offlineUser(userRoom);
    // console.log("One of sockets disconnected from our server.");
  });
});

// start the server
server.listen(config.PORT, () => {
  console.log("Magic happens on port " + config.PORT);
});
