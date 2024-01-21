const Complain = require("./complain.model");
const User = require("../user/user.model");
const { deleteFile } = require("../../util/deleteFile");
const dayjs = require("dayjs");
const { compressImage } = require("../../util/compressImage");

//FCM
var FCM = require("fcm-node");
var { SERVER_KEY } = require("../../config");
var fcm = new FCM(SERVER_KEY);

//store complain
exports.store = async (req, res) => {
  try {
    if (!req.body.contact || !req.body.message || !req.body.userId) {
      if (req.file) deleteFile(req.file);
      return res
        .status(200)
        .json({ status: false, message: "Invalid Details!!" });
    }

    const user = await User.findById(req.body.userId);

    if (!user) {
      return res
        .status(200)
        .json({ status: false, message: "User does not Exist!" });
    }

    if (req.file) {
      // compress image
      compressImage(req.file);
    }

    const complain = new Complain();
    complain.userId = user._id;
    complain.message = req.body.message;
    complain.contact = req.body.contact;
    complain.image = req.file ? req.file.path : "";

    await complain.save((error, complain) => {
      if (error) {
        return res
          .status(200)
          .json({ status: false, message: error.message || "Server Error" });
      } else
        return res.status(200).json({
          status: true,
          message: "Success!!",
          complain,
        });
    });
  } catch (error) {
    console.log(error);
    if (req.file) deleteFile(req.file);
    return res
      .status(500)
      .json({ status: false, error: error.message || "server error" });
  }
};

//get user complain [for admin]
exports.complainList = async (req, res) => {
  try {
    if (!req.query.type)
      return res
        .status(200)
        .json({ status: false, message: "Type is Required!" });

    let complain;
    if (req.query.type.trim().toLowerCase() === "pending") {
      complain = await Complain.find({
        solved: false,
      }).populate("userId", "name image rCoin country");
    } else if (req.query.type.trim().toLowerCase() === "solved") {
      complain = await Complain.find({
        solved: true,
      }).populate("userId", "name image rCoin country");
    }

    return res
      .status(200)
      .json({ status: true, message: "Success!!", complain });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

//solve complain
exports.solveComplain = async (req, res) => {
  try {
    const complain = await Complain.findById(req.params.complainId).populate(
      "userId",
      "name image rCoin country fcmToken isBlock"
    );

    if (!complain) {
      return res
        .status(200)
        .json({ status: false, message: "Complain does not Exist!!" });
    }

    complain.solved = true;
    await complain.save();

    if (
      complain.userId &&
      // complain.userId.isLogout === false &&
      !complain.userId.isBlock
    ) {
      const payload = {
        to: complain.userId.fcmToken,
        notification: {
          title: `Hello, ${complain.userId.name}`,
          body: "Your complain has been solved!",
        },
      };

      await fcm.send(payload, function (err, response) {
        if (err) {
          console.log("Something has gone wrong!", err);
        }
      });
    }

    return res
      .status(200)
      .json({ status: true, message: "Success!!", complain });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "server error" });
  }
};

//get user complain [for android]
exports.userComplainList = async (req, res) => {
  try {
    const user = await User.findById(req.query.userId);
    if (!user) {
      return res
        .status(200)
        .json({ status: false, message: "User does not Exist!!" });
    }

    const complain = await Complain.aggregate([
      { $match: { userId: { $eq: user._id } } },
    ]).sort({
      createdAt: -1,
    });

    let now = dayjs();

    const complainList = complain.map((data) => ({
      ...data,
      time:
        now.diff(data.createdAt, "minute") <= 60 &&
        now.diff(data.createdAt, "minute") >= 0
          ? now.diff(data.createdAt, "minute") + " minutes ago"
          : now.diff(data.createdAt, "hour") >= 24
          ? dayjs(data.createdAt).format("DD MMM, YYYY")
          : now.diff(data.createdAt, "hour") + " hour ago",
    }));

    return res
      .status(200)
      .json({ status: true, message: "Success!!", complain: complainList });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};
