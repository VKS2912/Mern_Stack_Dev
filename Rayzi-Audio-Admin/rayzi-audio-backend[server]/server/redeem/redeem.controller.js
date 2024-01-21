const Redeem = require("./redeem.model");
const User = require("../user/user.model");
const Wallet = require("../wallet/wallet.model");
const dayjs = require("dayjs");

//FCM
var FCM = require("fcm-node");
var { SERVER_KEY } = require("../../config");
var fcm = new FCM(SERVER_KEY);

// get redeem list [frontend]
exports.index = async (req, res) => {
  try {
    if (!req.query.type)
      return res
        .status(200)
        .json({ status: false, message: "Type is Required!" });

    let redeem;
    if (req.query.type.trim() === "pending") {
      redeem = await Redeem.find({ status: 0 })
        .populate("userId", "name image country")
        .sort({ createdAt: -1 });
    }
    if (req.query.type.trim() === "solved") {
      redeem = await Redeem.find({ status: 1 })
        .populate("userId", "name image country")
        .sort({ createdAt: -1 });
    }
    if (req.query.type.trim() === "decline") {
      redeem = await Redeem.find({ status: 2 })
        .populate("userId", "name image country")
        .sort({ createdAt: -1 });
    }

    if (!redeem)
      return res.status(200).json({ status: false, message: "No data Found!" });

    return res.status(200).json({ status: true, message: "Success!!", redeem });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

// get user redeem list
exports.userRedeem = async (req, res) => {
  try {
    const user = await User.findById(req.query.userId);

    if (!user)
      return res
        .status(200)
        .json({ status: false, message: "User does not Exist!" });

    // const redeem = await Redeem.find({ userId: user._id }).sort({
    // createdAt: -1,
    // });

    const redeem = await Redeem.aggregate([
      {
        $match: { userId: { $eq: user._id } },
      },
      {
        $project: {
          _id: 1,
          status: {
            $switch: {
              branches: [
                { case: { $eq: ["$status", 1] }, then: "Accepted" },
                { case: { $eq: ["$status", 2] }, then: "Declined" },
              ],
              default: "Pending",
            },
          },
          // status: 1,
          userId: 1,
          description: 1,
          rCoin: 1,
          paymentGateway: 1,
          date: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);

    if (!redeem)
      return res
        .status(200)
        .json({ status: false, message: "Data not Found!" });

    let now = dayjs();

    const redeemList = redeem.map((data) => ({
      ...data,
      time:
        now.diff(data.date, "minute") <= 60 &&
        now.diff(data.date, "minute") >= 0
          ? now.diff(data.date, "minute") + " minutes ago"
          : now.diff(data.date, "hour") >= 24
          ? dayjs(data.date).format("DD MMM, YYYY")
          : now.diff(data.date, "hour") + " hour ago",
    }));

    return res.status(200).json({
      status: redeemList.length > 0 ? true : false,
      message: redeemList.length > 0 ? "Success!" : "No Data Found",
      redeem: redeemList.length > 0 ? redeemList : [],
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

// create redeem request
exports.store = async (req, res) => {
  try {
    if (
      !req.body.userId ||
      !req.body.paymentGateway ||
      !req.body.description ||
      !req.body.rCoin
    )
      return res
        .status(200)
        .json({ status: false, message: "Invalid Details!!" });

    const user = await User.findById(req.body.userId);

    if (!user) {
      return res
        .status(200)
        .json({ status: false, message: "User does not Exist!" });
    }

    if (req.body.rCoin > user.rCoin) {
      return res
        .status(200)
        .json({ status: false, message: "Not Enough Coin for CaseOut." });
    }

    const redeem = new Redeem();

    redeem.userId = user._id;
    redeem.description = req.body.description.trim();
    redeem.rCoin = req.body.rCoin;
    redeem.paymentGateway = req.body.paymentGateway;
    redeem.date = new Date().toLocaleString();

    await redeem.save();

    user.rCoin -= req.body.rCoin;
    user.withdrawalRcoin += req.body.rCoin;
    await user.save();

    return res.status(200).json({ status: true, message: "Success!!" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

// accept or decline the redeem request
exports.update = async (req, res) => {
  try {
    const redeem = await Redeem.findById(req.params.redeemId);

    const user = await User.findById(redeem.userId);

    let payload;

    if (req.query.type === "accept") {
      redeem.status = 1;
      if (user) {
        payload = {
          to: user.fcmToken,
          notification: {
            title: "Your redeem request has been accepted!",
          },
        };

        user.withdrawalRcoin -= redeem.rCoin;
        await user.save();

        const outgoing = new Wallet();
        outgoing.userId = user._id;
        outgoing.rCoin = redeem.rCoin;
        outgoing.type = 7;
        outgoing.isIncome = false;
        outgoing.date = new Date().toLocaleString();
        await outgoing.save();
      }
    } else {
      redeem.status = 2;
      if (user) {
        payload = {
          to: user.fcmToken,
          notification: {
            title: "Your redeem request is declined!",
          },
        };

        user.withdrawalRcoin -= redeem.rCoin;
        user.rCoin += redeem.rCoin;
        await user.save();
      }
    }

    await redeem.save();

    if (user && !user.isBlock) {
      await fcm.send(payload, function (err, response) {
        if (err) {
          console.log("Something has gone wrong!", err);
        }
      });
    }

    return res.status(200).json({ status: true, message: "success", redeem });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};
