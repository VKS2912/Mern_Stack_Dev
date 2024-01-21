const User = require("./user.model");
const Follower = require("../follower/follower.model");
const Setting = require("../setting/setting.model");
const VIPPlan = require("../vipPlan/vipPlan.model");
const Wallet = require("../wallet/wallet.model");
const Level = require("../level/level.model");
const LiveUser = require("../liveUser/liveUser.model");
const fs = require("fs");
const config = require("../../config");
const moment = require("moment");
const arrayShuffle = require("shuffle-array");
const deleteFile = require("../../util/deleteFile");
const { compressImage } = require("../../util/compressImage");
const shuffleArray = require("shuffle-array");

// get users list
exports.index = async (req, res) => {
  try {
    const start = req.query.start ? parseInt(req.query.start) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;

    let matchQuery = {};
    if (req.query.search != "ALL") {
      matchQuery = {
        $or: [
          { username: { $regex: req.query.search, $options: "i" } },
          { gender: { $regex: req.query.search, $options: "i" } },
          { country: { $regex: req.query.search, $options: "i" } },
        ],
      };
    }

    let query;

    if (req.query.type === "Fake") {
      query = {
        isFake: true,
      };
    } else {
      query = {
        isFake: false,
      };
    }

    let dateFilterQuery = {};

    if (req.query.startDate !== "ALL" && req.query.endDate !== "ALL") {
      dateFilterQuery = {
        analyticDate: { $gte: req.query.startDate, $lte: req.query.endDate },
      };
    }

    const user = await User.aggregate([
      {
        $match: { ...matchQuery, ...query },
      },
      {
        $addFields: {
          analyticDate: {
            $arrayElemAt: [{ $split: ["$analyticDate", ", "] }, 0],
          },
        },
      },
      {
        $match: dateFilterQuery,
      },
      {
        $lookup: {
          from: 'levels',
          localField: 'level',
          foreignField: '_id',
          as: 'level',
        },
      },
      {
        $unwind: {
          path: '$level',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $facet: {
          user: [
            { $skip: (start - 1) * limit }, // how many records you want to skip
            { $limit: limit },
          ],
          gender: [
            { $group: { _id: '$gender', gender: { $sum: 1 } } }, // get total records count
          ],
          activeUser: [
            { $group: { _id: '$isOnline', activeUser: { $sum: 1 } } }, // get total records count
          ],
          pageInfo: [
            { $group: { _id: null, totalRecord: { $sum: 1 } } }, // get total records count
          ],
        },
      },
    ]);

    if (!user)
      return res
        .status(200)
        .json({ status: false, message: "Data not found!" });

    return res.status(200).json({
      status: true,
      message: "Success!!",
      total: user[0].pageInfo.length > 0 ? user[0].pageInfo[0].totalRecord : 0,
      activeUser:
        user[0].activeUser.length > 0 ? user[0].activeUser[0].activeUser : 0,
      maleFemale: user[0].gender,
      user: user[0].user,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

// get popular user by its follower count
exports.getPopularUser = async (req, res) => {
  try {
    if (!req.query.userId) {
      return res
        .send(200)
        .json({ status: false, message: "userId is required" });
    }

    const user = await User.findById(req.query.userId);
    if (!user) {
      return res.status(200).json({ status: false, message: "User not found" });
    }

    const followerIds = await Follower.find({ fromUserId: user._id }).distinct(
      "toUserId"
    );

    const top_users = await User.find({ _id: { $nin: followerIds } })
      .sort({
        followers: -1,
      })
      .limit(10);

    return res
      .status(200)
      .json({ status: true, message: "Success!!", top_users });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

// user signup and login
exports.loginSignup = async (req, res) => {
  try {
    debugger;
    if (!req.body.identity || !req.body.email)
      return res
        .status(200)
        .json({ status: false, message: "Invalid Details!", user: {} });

    console.log(req.body.email);

    const userExist = await User.findOne({ email: req.body.email }).populate(
      "level"
    );

    console.log("Outside if", userExist);

    if (userExist) {
      console.log("User Exist", userExist);
      // const user = await userFunction(userExist, req.body);
      userExist.fcmToken = req.body.fcmToken;
      await userExist.save();
      return res
        .status(200)
        .json({ status: true, message: "Success!!", user: userExist });
    }

    console.log("New user");

    const userNameExist = await User.find({
      username: req.body.username,
    }).countDocuments();

    if (userNameExist > 0) {
      return res.status(200).json({
        status: false,
        message: "Username already taken!",
        user: {},
      });
    }

    const newUser = new User();
    const randomChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let referralCode = "";
    for (let i = 0; i < 8; i++) {
      referralCode += randomChars.charAt(
        Math.floor(Math.random() * randomChars.length)
      );
    }
    const setting = await Setting.findOne({});
    newUser.referralCode = referralCode;
    newUser.analyticDate = new Date().toLocaleString();
    newUser.diamond += setting ? setting.loginBonus : 0;
    var digits = Math.floor(Math.random() * 90000000) + 10000000;
    newUser.uniqueId = digits;

    const user = await userFunction(newUser, req.body);

    const income = new Wallet();
    income.userId = user._id;
    income.rCoin = setting ? setting.loginBonus : 0;
    income.type = 5;
    income.date = new Date().toLocaleString();

    await income.save();

    const user_ = await updateLevel(user._id);

    return res
      .status(200)
      .json({ status: true, message: "Success!!", user: user_ });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      error: error.message || "Server Error",
      user: {},
    });
  }
};

const userFunction = async (user, data) => {
  user.name = data.name ? data.name : user.name;
  user.gender = data.gender ? data.gender : user.gender;
  user.age = data.age ? data.age : user.age;
  user.image =
    data.image === ""
      ? data.gender.toLowerCase() === "female"
        ? `${config.SERVER_PATH}storage/female.png`
        : `${config.SERVER_PATH}storage/male.png`
      : data.image;
  user.country = data.country;
  user.ip = data.ip;
  user.identity = data.identity;
  user.loginType = data.loginType;
  user.username = data.username ? data.username : user.username;
  user.email = data.email;
  user.fcmToken = data.fcmToken;
  user.lastLogin = new Date().toLocaleString();

  await user.save();

  return user;
};

// check username is already exist or not
exports.checkUsername = async (req, res) => {
  try {
    if (!req.query.username)
      return res
        .status(200)
        .json({ status: false, message: "Invalid Details!" });

    // const user = await User.findById(req.query.userId);

    // if (!user)
    //   return res
    //     .status(200)
    //     .json({ status: false, message: "User Does Not Exist !" });

    // if (user.username === req.query.username) {
    //   return res.status(200).json({
    //     status: true,
    //     message: "Username generated successfully!",
    //   });
    // }
    User.findOne({
      username: { $regex: req.query.username, $options: "i" },
    }).exec((error, user) => {
      if (error)
        return res
          .status(200)
          .json({ status: false, message: "Internal Server Error" });
      else {
        if (user) {
          return res
            .status(200)
            .json({ status: false, message: "Username already taken!" });
        } else
          return res.status(200).json({
            status: true,
            message: "Username generated successfully!",
          });
      }
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

// get profile of user who login
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.query.userId);
    if (!user)
      return res
        .status(200)
        .json({ status: false, message: "User does not Exist!", user: {} });

    const follower = await Follower.find({
      toUserId: user._id.toString(),
    }).countDocuments();

    const following = await Follower.find({
      fromUserId: user._id.toString(),
    }).countDocuments();

    if (user.plan.planId !== null && user.plan.planStartDate !== null) {
      const user_ = await checkPlan(user._id);
      return res
        .status(200)
        .json({ status: true, message: "success", user: user_ });
    }

    const user_ = await updateLevel(user._id);

    user_.followers = follower;
    user_.following = following;

    return res
      .status(200)
      .json({ status: true, message: "Success!!", user: user_ });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      error: error.message || "Server Error",
      user: "",
    });
  }
};

// update profile of user
exports.updateProfile = async (req, res) => {
  try {
    console.log("edit body", req.body);
    const user = await User.findById(req.body.userId).populate("level");

    if (!user)
      return res.status(200).json({
        status: false,
        message: "User does not Exist!",
        user: {},
      });

    if (req.file) {
      if (fs.existsSync(user.image)) {
        fs.unlinkSync(user.image);
      }

      // compress image
      compressImage(req.file);

      user.image = config.SERVER_PATH + req.file.path;
    }
    // else {
    //   user.image =
    //     req.body.gender.toLowerCase() === "female"
    //       ? `${config.SERVER_PATH}storage/female.png`
    //       : `${config.SERVER_PATH}storage/male.png`;
    // }

    user.name = req.body.name;
    user.username = req.body.username;
    user.bio = req.body.bio;
    user.gender = req.body.gender;
    user.age = req.body.age;

    await user.save();

    return res.status(200).json({ status: true, message: "Success!!", user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      error: error.message || "Server Error",
      user: {},
    });
  }
};

// get user profile of post[feed]
exports.getProfileUser = async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    if (!user)
      return res
        .status(200)
        .json({ status: false, message: "User does not Exist!" });

    let query;

    if (req.body.profileUserId) {
      query = {
        _id: req.body.profileUserId,
      };
    } else {
      query = {
        username: req.body.username,
      };
    }

    const profileUser = await User.findOne({ ...query })
      .populate("level")
      .select(
        "name username gender age image country bio followers following video post level isVIP"
      );

    if (!profileUser)
      return res
        .status(200)
        .json({ status: false, message: "User does not Exist!" });
    var isFollow = false;
    const isFollowExist = await Follower.exists({
      fromUserId: user._id,
      toUserId: profileUser._id,
    });

    if (isFollowExist) {
      isFollow = true;
    }

    return res.status(200).json({
      status: true,
      message: "Success!!",
      user: { ...profileUser._doc, userId: profileUser._id, isFollow },
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

// search user by name and username
exports.search = async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);

    if (!user)
      return res
        .status(200)
        .json({ status: false, message: "User does not Exist!" });

    const response = await User.aggregate([
      {
        $match: {
          $and: [
            { _id: { $ne: user._id } },
            { isBlock: false },
            {
              $or: [
                { name: { $regex: req.body.value, $options: "i" } },
                { username: { $regex: req.body.value, $options: "i" } },
              ],
            },
          ],
        },
      },
      {
        $lookup: {
          from: "followers",
          localField: "_id",
          foreignField: "toUserId",
          as: "follower",
        },
      },
      {
        $unwind: {
          path: "$follower",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "levels",
          localField: "level",
          foreignField: "_id",
          as: "level",
        },
      },
      {
        $unwind: {
          path: "$level",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          name: 1,
          username: 1,
          gender: 1,
          age: 1,
          image: 1,
          country: 1,
          bio: 1,
          followers: 1,
          following: 1,
          video: 1,
          post: 1,
          level: 1,
          isVIP: 1,
          isFollow: {
            $cond: {
              if: { $eq: [user._id, "$follower.fromUserId"] },
              then: true,
              else: false,
            },
          },
        },
      },
      { $group: { _id: "$_id", user: { $first: "$$ROOT" } } },
      {
        $project: {
          _id: 1,
          userId: "$user._id",
          name: "$user.name",
          username: "$user.username",
          gender: "$user.gender",
          age: "$user.age",
          image: "$user.image",
          country: "$user.country",
          bio: "$user.bio",
          followers: "$user.followers",
          following: "$user.following",
          video: "$user.video",
          post: "$user.post",
          level: "$user.level",
          isVIP: "$user.isVIP",
          isFollow: "$user.isFollow",
        },
      },
      {
        $facet: {
          user: [
            { $skip: req.body.start ? parseInt(req.body.start) : 0 }, // how many records you want to skip
            { $limit: req.body.limit ? parseInt(req.body.limit) : 20 },
          ],
        },
      },
    ]);

    return res
      .status(200)
      .json({ status: true, message: "Success!!", user: response[0].user });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

//check referral code is valid and add referral bonus
exports.referralCode = async (req, res) => {
  try {
    if (!req.body.userId || !req.body.referralCode)
      return res
        .status(200)
        .json({ status: false, message: "Invalid Details!!", user: {} });

    const user = await User.findById(req.body.userId).populate("level");

    if (!user)
      return res
        .status(200)
        .json({ status: false, message: "User does not Exist!!", user: {} });

    if (user.referralCode === req.body.referralCode.trim())
      return res.status(200).json({
        status: false,
        message: "You can't use your own Referral Code!",
        user: {},
      });

    const referralCodeUser = await User.findOne({
      referralCode: req.body.referralCode,
    });

    if (!referralCodeUser)
      return res.status(200).json({
        status: false,
        message: "Referral Code is not Exist!!",
        user: {},
      });

    const setting = await Setting.findOne({});
    if (!user.isReferral) {
      user.isReferral = true;
      user.diamond += setting ? setting.referralBonus : 0;
      user.save();

      referralCodeUser.rCoin += setting ? setting.referralBonus : 0;
      referralCodeUser.referralCount += 1;
      referralCodeUser.save();

      const income = new Wallet();

      income.userId = referralCodeUser._id;
      income.rCoin = setting ? setting.referralBonus : 0;
      income.type = 6;
      income.otherUserId = user._id;
      income.date = new Date().toLocaleString();

      await income.save();

      income.userId = user._id;
      income.diamond = setting ? setting.referralBonus : 0;
      income.type = 6;
      income.otherUserId = referralCodeUser._id;
      income.date = new Date().toLocaleString();

      await income.save();

      return res.status(200).json({ status: true, message: "Success!!", user });
    }

    return res.status(200).json({
      status: false,
      message: "User already used a Referral Code!!",
      user: {},
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

// block unblock user
exports.blockUnblock = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user)
      return res
        .status(200)
        .json({ status: false, message: "User does not Exist!" });

    user.isBlock = !user.isBlock;

    await user.save();

    return res.status(200).json({ status: true, message: "Success!!", user });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

// online the user
exports.userIsOnline = async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);

    if (!user) {
      return res
        .status(200)
        .json({ status: false, message: "User does not Exist!" });
    }

    user.isOnline = true;
    user.isBusy = false;

    await user.save();

    return res.status(200).json({ status: true, message: "Success!!" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

// offline the user
exports.offlineUser = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (user) {
      // user.isOnline = false;
      user.isBusy = false;
      user.token = null;
      user.channel = null;

      await user.save();

      await LiveUser.findOneAndDelete({ liveUserId: user._id });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

// get random match for call
exports.randomMatch = async (req, res) => {
  try {
    const user = await User.findById(req.query.userId).populate("level");
    if (!user)
      return res
        .status(200)
        .json({ status: false, message: "User does not Exist!" });

    const setting = await Setting.findOne({});

    const users = await User.find({
      _id: { $ne: user._id },
      loginType: { $ne: 3 },
      isOnline: true,
      isBusy: false,
      isFake: false,
    })
      .populate("level")
      .select(
        "name username gender age image country bio followers following video isFake post level isVIP loginType"
      );

    const shuffleUser = await arrayShuffle(users);

    return res.status(200).json({
      status: true,
      message: "Success!!",
      user:
        shuffleUser.length > 0
          ? {
              ...shuffleUser[0]._doc,
              userId: shuffleUser[0]._id,
            }
          : {},
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

// admin add or less the rCoin or diamond of user through admin panel
exports.addLessRcoinDiamond = async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);

    if (!user)
      return res
        .status(200)
        .json({ status: false, message: "User does not Exist!" });

    if (
      (req.body.rCoin && parseInt(req.body.rCoin) === user.rCoin) ||
      (req.body.diamond && parseInt(req.body.diamond) === user.diamond)
    )
      return res.status(200).json({ status: true, message: "Success!!", user });

    const wallet = new Wallet();

    if (req.body.rCoin) {
      if (user.rCoin > req.body.rCoin) {
        // put entry on history in outgoing
        wallet.isIncome = false;
        wallet.rCoin = user.rCoin - req.body.rCoin;
      } else {
        // put entry on history in income
        wallet.isIncome = true;
        wallet.rCoin = req.body.rCoin - user.rCoin;
      }
      user.rCoin = req.body.rCoin;
    }
    if (req.body.diamond) {
      if (user.diamond > req.body.diamond) {
        // put entry on history in outgoing
        wallet.isIncome = false;
        wallet.diamond = user.diamond - req.body.diamond;
      } else {
        // put entry on history in income
        wallet.isIncome = true;
        wallet.diamond = req.body.diamond - user.diamond;
      }
      user.diamond = req.body.diamond;
    }
    await user.save();

    wallet.userId = user._id;
    wallet.type = 8;
    wallet.date = new Date().toLocaleString();

    await wallet.save();

    return res.status(200).json({ status: true, message: "Success!!", user });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

//check user plan is expired or not
const checkPlan = async (userId, res) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(200)
        .json({ status: false, message: "User does not exist!!" });
    }

    await updateLevel(user._id);

    if (user.plan.planStartDate !== null && user.plan.planId !== null) {
      const plan = await VIPPlan.findById(user.plan.planId);
      if (!plan) {
        return res
          .status(200)
          .json({ status: false, message: "Plan does not exist!!" });
      }

      if (plan.validityType.toLowerCase() === "day") {
        const diffTime = moment(new Date()).diff(
          moment(new Date(user.plan.planStartDate)),
          "day"
        );
        if (diffTime > plan.validity) {
          user.isVIP = false;
          user.plan.planStartDate = null;
          user.plan.planId = null;
        }
      }
      if (plan.validityType.toLowerCase() === "month") {
        const diffTime = moment(new Date()).diff(
          moment(new Date(user.plan.planStartDate)),
          "month"
        );
        if (diffTime >= plan.validity) {
          user.isVIP = false;
          user.plan.planStartDate = null;
          user.plan.planId = null;
        }
      }
      if (plan.validityType.toLowerCase() === "year") {
        const diffTime = moment(new Date()).diff(
          moment(new Date(user.plan.planStartDate)),
          "year"
        );
        if (diffTime >= plan.validity) {
          user.isVIP = false;
          user.plan.planStartDate = null;
          user.plan.planId = null;
        }
      }
    }

    await user.save();

    const user_ = await User.findById(userId).populate("level");
    return user_;
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, error });
  }
};

// update level of user
const updateLevel = async (userId, res) => {
  try {
    const user = await User.findById(userId);
    if (!user)
      return res
        .status(200)
        .json({ status: false, message: "User does not Exist!!" });

    const level = await Level.find().sort({
      coin: -1,
    });

    await level.map(async (data) => {
      if (user.spentCoin <= data.coin) {
        return (user.level = data._id);
      }
    });

    await user.save();

    const user_ = await User.findById(userId).populate("level");

    return user_;
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

exports.IdGenerate = async (req, res) => {
  try {
    const user = await User.find({});
    user.map(async (res) => {
      var digits = Math.floor(Math.random() * 90000000) + 10000000;

      res.uniqueId = digits;
      await res.save();
    });
    return res.status(200).json({ status: true, message: "success" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};
