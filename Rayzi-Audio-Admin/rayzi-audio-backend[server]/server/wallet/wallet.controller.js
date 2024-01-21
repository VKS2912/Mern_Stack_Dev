const Wallet = require("./wallet.model");
const User = require("../user/user.model");
const Setting = require("../setting/setting.model");
const LiveStreamingHistory = require("../liveStreamingHistory/liveStreamingHistory.model");
const { RtcTokenBuilder, RtcRole } = require("agora-access-token");

//FCM node
var FCM = require("fcm-node");
var config = require("../../config");
var fcm = new FCM(config.SERVER_KEY);

const addFieldQuery = {
  analyticDate: { $arrayElemAt: [{ $split: ["$date", ", "] }, 0] },
};

// get free diamond from watching ad
exports.getDiamondFromAd = async (req, res) => {
  try {
    const user = await User.findById(req.body.userId).populate("level");

    if (!user)
      return res
        .status(200)
        .json({ status: false, message: "User does not Exist!" });

    const setting = await Setting.findOne({});

    if (!setting)
      return res
        .status(200)
        .json({ status: false, message: "Setting data not Found!" });

    if (
      user.ad &&
      user.ad.date !== null &&
      user.ad.date.split(",")[0] ===
        new Date().toLocaleString().split(",")[0] &&
      user.ad.count >= setting.maxAdPerDay
    ) {
      return res
        .status(200)
        .json({ status: false, message: "You exceed your Ad limit." });
    }

    user.diamond += setting ? setting.freeDiamondForAd : 0;
    user.ad.count += 1;
    user.ad.date = new Date().toLocaleString();

    await user.save();

    const income = new Wallet();
    income.userId = user._id;
    income.diamond = setting ? setting.freeDiamondForAd : 0;
    income.type = 4;
    income.date = new Date().toLocaleString();
    await income.save();

    return res.status(200).json({ status: true, message: "Success!!", user });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

// convert rCoin to diamond
exports.convertRcoinToDiamond = async (req, res) => {
  try {
    if (!req.body.userId || !req.body.rCoin)
      return res
        .status(200)
        .json({ status: false, message: "Invalid Details!!" });
    const user = await User.findById(req.body.userId).populate("level");

    if (!user)
      return res
        .status(200)
        .json({ status: false, message: "User does not Exist!", user: {} });
    if (req.body.rCoin > user.rCoin)
      return res.status(200).json({
        status: false,
        message: "Not enough coin for conversion!",
        user: "",
      });

    const setting = await Setting.findOne({});

    if (!setting)
      return res.status(200).json({
        status: false,
        message: "Setting data not Found!",
        user: null,
      });

    user.rCoin -= req.body.rCoin;
    user.diamond += parseInt(req.body.rCoin / setting.rCoinForDiamond);
    await user.save();

    const income = new Wallet();
    income.userId = user._id;
    income.diamond = parseInt(req.body.rCoin / setting.rCoinForDiamond);
    income.type = 1;
    income.isIncome = true;
    income.date = new Date().toLocaleString();

    await income.save();

    const outgoing = new Wallet();
    outgoing.userId = user._id;
    outgoing.rCoin = req.body.rCoin;
    outgoing.type = 1;
    outgoing.isIncome = false;
    outgoing.date = new Date().toLocaleString();

    await outgoing.save();

    return res.status(200).json({ status: true, message: "Success!!", user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      error: error.message || "Server Error",
      user: "",
    });
  }
};

// store call detail when user do call
exports.call = async (req, res) => {
  try {
    if (!req.body.callerUserId || !req.body.receiverUserId || !req.body.channel)
      return res
        .status(200)
        .json({ status: false, message: "Invalid Details!" });

    const callerUser = await User.findById(req.body.callerUserId);
    if (!callerUser)
      return res
        .status(200)
        .json({ status: false, message: "Caller user does not Exist!" });

    const receiverUser = await User.findById(req.body.receiverUserId);
    if (!receiverUser)
      return res
        .status(200)
        .json({ status: false, message: "Receiver user does not Exist!" });

    const setting = await Setting.findOne({});
    if (!setting)
      return res
        .status(200)
        .json({ status: false, message: "Setting Not Found" });

    const role = RtcRole.PUBLISHER;
    const uid = req.body.agoraUID ? req.body.agoraUID : 0;
    const expirationTimeInSeconds = 24 * 3600;
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

    const token = await RtcTokenBuilder.buildTokenWithUid(
      setting.agoraKey,
      setting.agoraCertificate,
      req.body.channel,
      uid,
      role,
      privilegeExpiredTs
    );

    const outgoing = new Wallet();
    outgoing.userId = callerUser._id; //call user id
    outgoing.diamond = 0;
    outgoing.type = 3;
    outgoing.isIncome = false;
    outgoing.otherUserId = receiverUser._id; //call receiver user id
    outgoing.date = new Date().toLocaleString();

    await outgoing.save();

    if (!receiverUser.isBlock && receiverUser.isOnline) {
      const payload = {
        to: receiverUser.fcmToken,
        notification: {
          title: `Incoming Call..`,
          body: `Call From ${callerUser.name}`,
          content_available: true,
        },
        data: {
          title: `Incoming Call..`,
          callFrom: callerUser.name,
          action: "",
          data: {
            userId1: String(receiverUser._id),
            userId2: String(callerUser._id),
            user2Name: callerUser.name,
            user2Image: callerUser.image,
            callRoomId: String(outgoing._id),
          },
          type: "CALL",
        },
      };

      await fcm.send(payload, function (err, response) {
        if (err) {
          console.log("Something has gone wrong!", err);
        }
      });
    }

    return res.status(200).json({
      status: true,
      message: "Success!!",
      callId: outgoing._id,
      token,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

// get income and outgoing total [diamond & rCoin]
exports.incomeOutgoingDiamondRcoinTotal = async (req, res) => {
  try {
    const user = await User.findById(req.query.userId);

    if (!user)
      return res
        .status(200)
        .json({ status: false, message: "User does not Exist!" });

    // remove 0 from date string if 0 exist
    var sDate = req.query.startDate.replace(/(^|\/)0+/g, "$1");
    var eDate = req.query.endDate.replace(/(^|\/)0+/g, "$1");

    const dateFilterQuery = {
      analyticDate: { $gte: sDate, $lte: eDate },
    };

    const income = await Wallet.aggregate([
      {
        $match: { userId: user._id },
      },
      {
        $addFields: addFieldQuery,
      },
      {
        $match: dateFilterQuery,
      },
      {
        $group: {
          _id: null,
          diamondIncome: {
            $sum: {
              $cond: [{ $eq: ["$isIncome", true] }, "$diamond", 0],
            },
          },
          rCoinIncome: {
            $sum: {
              $cond: [{ $eq: ["$isIncome", true] }, "$rCoin", 0],
            },
          },
          diamondOutgoing: {
            $sum: {
              $cond: [{ $eq: ["$isIncome", false] }, "$diamond", 0],
            },
          },
          rCoinOutgoing: {
            $sum: {
              $cond: [{ $eq: ["$isIncome", false] }, "$rCoin", 0],
            },
          },
        },
      },
    ]);

    const diamond = {
      income: income.length > 0 ? income[0].diamondIncome : 0,
      outgoing: income.length > 0 ? income[0].diamondOutgoing : 0,
    };
    const rCoin = {
      income: income.length > 0 ? income[0].rCoinIncome : 0,
      outgoing: income.length > 0 ? income[0].rCoinOutgoing : 0,
    };

    return res
      .status(200)
      .json({ status: true, message: "Success!!", diamond, rCoin });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

// get income and outgoing history [diamond & rCoin]
exports.incomeOutgoingDiamondRcoinHistory = async (req, res) => {
  try {
    const user = await User.findById(req.query.userId);

    if (!user)
      return res
        .status(200)
        .json({ status: false, message: "User does not Exist!" });

    // remove 0 from date string if 0 exist
    var sDate = req.query.startDate.replace(/(^|\/)0+/g, "$1");
    var eDate = req.query.endDate.replace(/(^|\/)0+/g, "$1");

    const dateFilterQuery = {
      analyticDate: { $gte: sDate, $lte: eDate },
    };

    let diamondCoinQuery, sumField;
    if (req.query.type === "diamond") {
      diamondCoinQuery = {
        diamond: { $ne: null },
      };
      sumField = "$diamond";
    } else {
      diamondCoinQuery = {
        rCoin: { $ne: null },
      };
      sumField = "$rCoin";
    }

    const history = await Wallet.aggregate([
      {
        $match: { $and: [{ userId: user._id }, diamondCoinQuery] },
      },
      {
        $addFields: addFieldQuery,
      },
      {
        $match: dateFilterQuery,
      },
      {
        $lookup: {
          from: "users",
          localField: "otherUserId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          isAdd: {
            $cond: [{ $eq: ["$isIncome", true] }, true, false],
          },
        },
      },
      {
        $project: {
          diamond: 1,
          rCoin: 1,
          paymentGateway: 1,
          type: 1,
          date: 1,
          userId: { $ifNull: ["$user._id", null] },
          userName: { $ifNull: ["$user.name", null] },
          isAdd: 1,
        },
      },
      {
        $sort: { date: -1 },
      },
      {
        $facet: {
          income: [
            { $skip: req.query.start ? parseInt(req.query.start) : 0 }, // how many records you want to skip
            { $limit: req.query.limit ? parseInt(req.query.limit) : 10 },
          ],
          incomeTotal: [
            {
              $group: {
                _id: null,
                income: {
                  $sum: {
                    $cond: [{ $eq: ["$isAdd", true] }, sumField, 0],
                  },
                },
                outgoing: {
                  $sum: {
                    $cond: [{ $eq: ["$isAdd", false] }, sumField, 0],
                  },
                },
              },
            },
          ],
        },
      },
    ]);

    return res.status(200).json({
      status: true,
      message: "Success!!",
      incomeTotal:
        history[0].incomeTotal.length > 0
          ? history[0].incomeTotal[0].income
          : 0,
      outgoingTotal:
        history[0].incomeTotal.length > 0
          ? history[0].incomeTotal[0].outgoing
          : 0,
      history: history[0].income,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

// get all history of user [admin panel]
exports.history = async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);

    if (!user)
      return res
        .status(200)
        .json({ status: false, message: "User does not Exist!" });

    const start = req.body.start ? parseInt(req.body.start) : 1;
    const limit = req.body.limit ? parseInt(req.body.limit) : 10;
    const addFieldQuery_ = {
      shortDate: { $arrayElemAt: [{ $split: ["$date", ", "] }, 0] },
    };

    let dateFilterQuery = {};

    if (req.body.startDate && req.body.endDate) {
      dateFilterQuery = {
        shortDate: { $gte: req.body.startDate, $lte: req.body.endDate },
      };
    }

    let history;

    if (req.body.type === "diamond" || req.body.type === "rCoin") {
      let diamondCoinQuery, sumField;
      if (req.body.type === "diamond") {
        diamondCoinQuery = {
          diamond: { $ne: null },
        };
        sumField = "$diamond";
      } else {
        diamondCoinQuery = {
          rCoin: { $ne: null },
        };
        sumField = "$rCoin";
      }

      history = await Wallet.aggregate([
        {
          $match: { $and: [{ userId: user._id }, diamondCoinQuery] },
        },
        {
          $addFields: addFieldQuery_,
        },
        {
          $match: dateFilterQuery,
        },
        {
          $lookup: {
            from: "users",
            localField: "otherUserId",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $unwind: {
            path: "$user",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $addFields: {
            income: {
              $cond: [{ $eq: ["$isIncome", true] }, true, false],
            },
          },
        },
        {
          $project: {
            diamond: 1,
            rCoin: 1,
            paymentGateway: 1,
            type: 1,
            date: 1,
            userId: "$user",
            userName: { $ifNull: ["$user.name", null] },
            income: 1,
          },
        },
        {
          $sort: { date: -1 },
        },
        {
          $facet: {
            income: [
              { $skip: (start - 1) * limit }, // how many records you want to skip
              { $limit: limit },
            ],
            pageInfo: [
              { $group: { _id: null, totalRecord: { $sum: 1 } } }, // get total records count
            ],
            incomeTotal: [
              {
                $group: {
                  _id: null,
                  income: {
                    $sum: {
                      $cond: [{ $eq: ["$income", true] }, sumField, 0],
                    },
                  },
                  outgoing: {
                    $sum: {
                      $cond: [{ $eq: ["$income", false] }, sumField, 0],
                    },
                  },
                },
              },
            ],
          },
        },
      ]);

      return res.status(200).json({
        status: true,
        message: "Success!!",
        total:
          history[0].pageInfo.length > 0
            ? history[0].pageInfo[0].totalRecord
            : 0,
        incomeTotal:
          history[0].incomeTotal.length > 0
            ? history[0].incomeTotal[0].income
            : 0,
        outgoingTotal:
          history[0].incomeTotal.length > 0
            ? history[0].incomeTotal[0].outgoing
            : 0,
        history: history[0].income,
      });
    } else if (req.body.type === "call") {
      history = await Wallet.aggregate([
        {
          $match: {
            $or: [
              { $and: [{ userId: user._id }, { otherUserId: user._id }] },
              { $and: [{ diamond: { $ne: null } }, { type: 3 }] },
            ],
          },
        },
        {
          $addFields: addFieldQuery_,
        },
        {
          $match: dateFilterQuery,
        },
        {
          $lookup: {
            from: "users",
            as: "user",
            let: { otherUserIds: "$otherUserId", userIds: "$userId" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $cond: {
                      if: { $eq: ["$$userIds", user._id] },
                      then: { $eq: ["$$otherUserIds", "$_id"] },
                      else: { $eq: ["$$userIds", "$_id"] },
                    },
                  },
                },
              },
              {
                $project: {
                  name: 1,
                },
              },
            ],
          },
        },
        {
          $unwind: {
            path: "$user",
            preserveNullAndEmptyArrays: false,
          },
        },
        {
          $project: {
            callStartTime: 1,
            callEndTime: 1,
            callConnect: 1,
            diamond: 1,
            // duration:{$cond: [{ $eq: ["$callConnect", false]}, "00:00:00", moment.utc(moment(new Date("$callEndTime")).diff(moment(new Date("$callStartTime")))).format("HH:mm:ss")]},
            date: 1,
            type: {
              $cond: [
                { $eq: ["$callConnect", false] },
                "MissedCall",
                {
                  $cond: [
                    { $eq: ["$userId", user._id] },
                    "Outgoing",
                    "Incoming",
                  ],
                },
              ],
            },
            userId: "$user",
            userName: { $ifNull: ["$user.name", null] },
          },
        },
        {
          $sort: { date: -1 },
        },
        {
          $facet: {
            callHistory: [
              { $skip: (start - 1) * limit }, // how many records you want to skip
              { $limit: limit },
            ],
            pageInfo: [
              { $group: { _id: null, totalRecord: { $sum: 1 } } }, // get total records count
            ],
            callCharge: [
              {
                $group: {
                  _id: null,
                  total: {
                    $sum: {
                      $cond: [{ $eq: ["$callConnect", true] }, "$diamond", 0],
                    },
                  },
                },
              },
            ],
          },
        },
      ]);

      return res.status(200).json({
        status: true,
        message: "Success!!",
        total:
          history[0].pageInfo.length > 0
            ? history[0].pageInfo[0].totalRecord
            : 0,
        totalCallCharge:
          history[0].callCharge.length > 0 ? history[0].callCharge[0].total : 0,
        history: history[0].callHistory,
      });
    } else if (req.body.type === "liveStreaming") {
      history = await LiveStreamingHistory.aggregate([
        {
          $match: {
            userId: user._id,
          },
        },
        {
          $addFields: {
            shortDate: { $arrayElemAt: [{ $split: ["$startTime", ", "] }, 0] },
          },
        },
        {
          $match: dateFilterQuery,
        },
        {
          $project: {
            user: 1,
            duration: 1,
            gifts: 1,
            comments: 1,
            fans: 1,
            rCoin: 1,
            startTime: 1,
            endTime: 1,
          },
        },
        {
          $sort: { date: -1 },
        },
        {
          $facet: {
            LiveStreamingHistory: [
              { $skip: (start - 1) * limit }, // how many records you want to skip
              { $limit: limit },
            ],
            pageInfo: [
              { $group: { _id: null, totalRecord: { $sum: 1 } } }, // get total records count
            ],
            income: [
              {
                $group: {
                  _id: null,
                  total: {
                    $sum: "$rCoin",
                  },
                },
              },
            ],
          },
        },
      ]);

      return res.status(200).json({
        status: true,
        message: "Success!!",
        total:
          history[0].pageInfo.length > 0
            ? history[0].pageInfo[0].totalRecord
            : 0,
        income: history[0].income.length > 0 ? history[0].income[0].total : 0,
        history: history[0].LiveStreamingHistory,
      });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

exports.sendGiftFakeHost = async (req, res) => {
  try {
    if (!req.body.senderUserId && !req.body.coin) {
      return res.send({
        status: true,
        message: "invalid detailds",
      });
    }
    const senderUser = await User.findById(req.body.senderUserId).populate(
      "level"
    );
    const receiverUser = await User.findById(req.body.senderUserId).populate(
      "level"
    );
    if (!senderUser) {
      return res.send({
        status: true,
        message: "senderUser dose not exist",
      });
    }

    if (senderUser.diamond < req.body.coin) {
      return res.send({
        status: true,
        message: "insufficent diamond",
      });
    }

    senderUser.diamond -= req.body.coin;
    senderUser.spentCoin += req.body.coin;
    await senderUser.save();

    console.log("senderUser in Gift send", senderUser);
    if (req.body.type == "live") {
      if (receiverUser) {
        const outgoing = new Wallet();
        outgoing.userId = senderUser._id;
        outgoing.diamond = req.body.coin;
        outgoing.type = 0;
        outgoing.isIncome = false;
        outgoing.otherUserId = receiverUser._id;
        outgoing.date = new Date().toLocaleString();

        await outgoing.save();

        receiverUser.rCoin += req.body.coin;
        await receiverUser.save();

        const income = new Wallet();
        income.userId = receiverUser._id;
        income.rCoin = req.body.coin;
        income.type = 0;
        income.isIncome = true;
        income.otherUserId = senderUser._id;
        income.date = new Date().toLocaleString();

        await income.save();
      }
    }

    if (req.body.type == "call") {
      if (receiverUser) {
        const outgoing = new Wallet();
        outgoing.userId = senderUser._id;
        outgoing.diamond = req.body.coin;
        outgoing.type = 3;
        outgoing.isIncome = false;
        outgoing.otherUserId = receiverUser._id;
        outgoing.date = new Date().toLocaleString();

        await outgoing.save();

        receiverUser.rCoin += req.body.coin;
        await receiverUser.save();

        const income = new Wallet();
        income.userId = receiverUser._id;
        income.rCoin = req.body.coin;
        income.type = 3;
        income.isIncome = true;
        income.otherUserId = senderUser._id;
        income.date = new Date().toLocaleString();

        await income.save();
      }
    }

    return res.send({
      status: true,
      message: "success",
      senderUser,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};
