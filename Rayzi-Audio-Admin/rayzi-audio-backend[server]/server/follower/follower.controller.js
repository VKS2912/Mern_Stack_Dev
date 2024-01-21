const Follower = require("./follower.model");
const User = require("../user/user.model");
const LiveStreamingHistory = require("../liveStreamingHistory/liveStreamingHistory.model");

//FCM node
var FCM = require("fcm-node");
var config = require("../../config");
var fcm = new FCM(config.SERVER_KEY);

exports.follow = async (req, res) => {
  try {
    if (!req.body.fromUserId || !req.body.toUserId)
      return res
        .status(200)
        .json({ status: false, message: "Invalid Details!" });

    const fromUserExist = await User.findById(req.body.fromUserId);

    if (!fromUserExist) {
      return res
        .status(200)
        .json({ status: false, message: "User does not Exist!" });
    }

    const toUserExist = await User.findById(req.body.toUserId);

    if (!toUserExist) {
      return res
        .status(200)
        .json({ status: false, message: "User does not Exist!" });
    }

    const followUser = await Follower.findOne({
      $and: [
        {
          fromUserId: fromUserExist._id,
          toUserId: toUserExist._id,
        },
      ],
    });

    if (followUser) {
      return res
        .status(200)
        .send({ status: true, message: "User followed successfully!!" });
    }
  

    const followerData = {
      fromUserId: fromUserExist._id,
      toUserId: toUserExist._id,
    };

    const addFollower = new Follower(followerData);

    addFollower.save(async (err, result) => {
      if (err)
        return res
          .status(500)
          .json({ status: false, message: "Internal Server Error" });
      else {
        await User.updateOne(
          { _id: fromUserExist._id },
          { $inc: { following: 1 } }
        );
        await User.updateOne(
          { _id: toUserExist._id },
          { $inc: { followers: 1 } }
        );

        if (req.body.liveStreamingId) {
          const liveStreamingHistory = await LiveStreamingHistory.findById(
            req.body.liveStreamingId
          );

          if (liveStreamingHistory) {
            liveStreamingHistory.fans += 1;
            await liveStreamingHistory.save();
          }
        }

        return res
          .status(200)
          .send({ status: true, message: "User followed successfully!!" });
      }
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

exports.unFollow = async (req, res) => {
  try {
    if (!req.body.fromUserId || !req.body.toUserId)
      return res
        .status(200)
        .json({ status: false, message: "Invalid Details!" });

    const fromUserExist = await User.findById(req.body.fromUserId);

    if (!fromUserExist) {
      return res
        .status(200)
        .json({ status: false, message: "User does not Exist!" });
    }

    const toUserExist = await User.findById(req.body.toUserId);

    if (!toUserExist) {
      return res
        .status(200)
        .json({ status: false, message: "User does not Exist!" });
    }

    Follower.deleteOne({
      fromUserId: fromUserExist._id,
      toUserId: toUserExist._id,
    }).exec(async (err, result) => {
      if (err)
        return res
          .status(500)
          .json({ status: false, message: "Internal Server Error" });
      else {
        if (fromUserExist.following > 0) {
          await User.updateOne(
            { _id: fromUserExist._id },
            { $inc: { following: -1 } }
          );
        }
        if (toUserExist.followers > 0) {
          await User.updateOne(
            { _id: toUserExist._id },
            { $inc: { followers: -1 } }
          );
        }

        return res
          .status(200)
          .send({ status: true, message: "User unFollowed successfully!!" });
      }
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

// hirenbhai: date:6/1/22 toggle follow unFollow
exports.followUnFollow = async (req, res) => {
  try {
    if (!req.body.fromUserId || !req.body.toUserId)
      return res
        .status(200)
        .json({ status: false, message: "Invalid Details!" });

    const fromUserExist = await User.findById(req.body.fromUserId);

    if (!fromUserExist) {
      return res
        .status(200)
        .json({ status: false, message: "User does not Exist!" });
    }

    const toUserExist = await User.findById(req.body.toUserId);

    if (!toUserExist) {
      return res
        .status(200)
        .json({ status: false, message: "User does not Exist!" });
    }

    const followUser = await Follower.findOne({
      $and: [
        {
          fromUserId: fromUserExist._id,
          toUserId: toUserExist._id,
        },
      ],
    });

    console.log("followUser", followUser);
    // unFollow
    if (followUser) {
      await Follower.deleteOne({
        fromUserId: fromUserExist._id,
        toUserId: toUserExist._id,
      });

      if (fromUserExist.following > 0) {
        await User.updateOne(
          { _id: fromUserExist._id },
          { $inc: { following: -1 } }
        );
      }
      if (toUserExist.followers > 0) {
        await User.updateOne(
          { _id: toUserExist._id },
          { $inc: { followers: -1 } }
        );
      }
      console.log("unFollowed Done ");

      return res.status(200).send({
        status: true,
        message: "User unFollowed successfully!!",
        isFollow: false,
      });
    }

    const followerData = {
      fromUserId: fromUserExist._id,
      toUserId: toUserExist._id,
    };

    const addFollower = new Follower(followerData);

    await addFollower.save();
    console.log("addFollower", addFollower);

    await User.updateOne(
      { _id: fromUserExist._id },
      { $inc: { following: 1 } }
    );
    await User.updateOne({ _id: toUserExist._id }, { $inc: { followers: 1 } });

    if (req.body.liveStreamingId) {
      const liveStreamingHistory = await LiveStreamingHistory.findById(
        req.body.liveStreamingId
      );

      if (liveStreamingHistory) {
        liveStreamingHistory.fans += 1;
        await liveStreamingHistory.save();
      }
    }

    if (
      toUserExist &&
      !toUserExist.isBlock &&
      toUserExist.notification.newFollow
    ) {
      const payload = {
        to: toUserExist.fcmToken,
        notification: {
          body: `${fromUserExist.name} started following you.`,
          title: "New Follower",
        },
        data: {
          data: fromUserExist._id,
          type: "USER",
        },
      };
      await fcm.send(payload, function (err, response) {
        if (err) {
          console.log("Something has gone wrong!", err);
        }
      });
    }
    console.log("Follow Done ");

    return res.status(200).send({
      status: true,
      message: "User followed successfully!!",
      isFollow: true,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

exports.followerList = async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    if (!user) {
      return res
        .status(200)
        .json({ status: false, message: "User does not Exist!" });
    }

    await Follower.aggregate([
      {
        $match: { toUserId: user._id },
      },
      {
        $lookup: {
          from: "users",
          localField: "fromUserId",
          foreignField: "_id",
          as: "followers",
        },
      },
      {
        $unwind: {
          path: "$followers",
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $lookup: {
          from: "levels",
          localField: "followers.level",
          foreignField: "_id",
          as: "level",
        },
      },
      {
        $unwind: {
          path: "$level",
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $project: {
          userId: "$followers._id",
          name: "$followers.name",
          username: "$followers.username",
          gender: "$followers.gender",
          age: "$followers.age",
          image: "$followers.image",
          country: "$followers.country",
          bio: "$followers.bio",
          followers: "$followers.followers",
          following: "$followers.following",
          video: "$followers.video",
          post: "$followers.post",
          level: "$level",
          isVIP: "$followers.isVIP",
        },
      },
      { $addFields: { isFollow: false } },
      {
        $facet: {
          follower: [
            { $skip: req.body.start ? parseInt(req.body.start) : 0 }, // how many records you want to skip
            { $limit: req.body.limit ? parseInt(req.body.limit) : 20 },
          ],
        },
      },
    ]).exec(async (error, data) => {
      if (error)
        return res.status(200).json({ status: false, message: error.message });
      else {
        let followers = [];

        for (let i = 0; i < data[0].follower.length; i++) {
          const follower = data[0].follower[i];

          const isFollow = await Follower.exists({
            fromUserId: user._id,
            toUserId: follower.userId,
          });
          follower.isFollow = isFollow;
          await followers.push(follower);
        }

        return res
          .status(200)
          .json({ status: true, message: "Success!!", user: followers });
      }
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

exports.followingList = async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);

    if (!user) {
      return res
        .status(200)
        .json({ status: false, message: "User does not Exist!" });
    }

    const following = await Follower.aggregate([
      {
        $match: { fromUserId: user._id },
      },
      {
        $lookup: {
          from: "users",
          localField: "toUserId",
          foreignField: "_id",
          as: "following",
        },
      },
      {
        $unwind: {
          path: "$following",
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $lookup: {
          from: "levels",
          localField: "following.level",
          foreignField: "_id",
          as: "level",
        },
      },
      {
        $unwind: {
          path: "$level",
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $project: {
          userId: "$following._id",
          name: "$following.name",
          username: "$following.username",
          gender: "$following.gender",
          age: "$following.age",
          image: "$following.image",
          country: "$following.country",
          bio: "$following.bio",
          followers: "$following.followers",
          following: "$following.following",
          video: "$following.video",
          post: "$following.post",
          level: "$level",
          isVIP: "$following.isVIP",
        },
      },
      { $addFields: { isFollow: true } },
      {
        $facet: {
          following: [
            { $skip: req.body.start ? parseInt(req.body.start) : 0 }, // how many records you want to skip
            { $limit: req.body.limit ? parseInt(req.body.limit) : 20 },
          ],
        },
      },
    ]);

    return res.status(200).json({
      status: true,
      message: "Success!!",
      user: following[0].following,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

//get users followers & following list (for admin panel)
exports.followerFollowing = async (req, res) => {
  try {
    const user = await User.findById(req.query.userId);
    if (!user)
      return res
        .status(200)
        .json({ status: false, message: "User does not Exist!" });
    if (req.query.type === "following") {
      const following = await Follower.find({ fromUserId: user._id }).populate(
        "toUserId"
      );
      if (!following)
        return res
          .status(200)
          .json({ status: false, message: "Data not found" });
      return res
        .status(200)
        .json({ status: true, message: "Success!!", follow: following });
    } else {
      const follower = await Follower.find({ toUserId: user._id }).populate(
        "fromUserId"
      );
      if (!follower)
        return res
          .status(200)
          .json({ status: false, message: "Data not found" });
      return res
        .status(200)
        .json({ status: true, message: "Success!!", follow: follower });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};
