const Comment = require("./comment.model");
const User = require("../user/user.model");
const Post = require("../post/post.model");
const Video = require("../video/video.model");
const dayjs = require("dayjs");
const mongoose = require("mongoose");

//FCM node
var FCM = require("fcm-node");
var config = require("../../config");
var fcm = new FCM(config.SERVER_KEY);

//create comment
exports.store = async (req, res) => {
  try {
    if (!req.body.userId || !req.body.comment)
      return res
        .status(200)
        .json({ status: false, message: "Invalid Details!" });

    if (!req.body.postId && !req.body.videoId)
      return res
        .status(200)
        .json({ status: false, message: "Invalid Details!" });

    const user = await User.findById(req.body.userId);
    if (!user) {
      return res
        .status(200)
        .json({ status: false, message: "User does not Exist!" });
    }

    const comment = new Comment();

    if (req.body.postId) {
      const post = await Post.findById(req.body.postId).populate(
        "userId",
        "fcmToken notification isBlock name image isVIP"
      );
      if (!post) {
        return res
          .status(200)
          .json({ status: false, message: "Post does not Exist!" });
      }
      comment.post = post._id;

      post.comment += 1;
      await post.save();


      if (
        post.userId &&
        post.userId._id.toString() !== user._id.toString() &&
        !post.userId.isBlock &&
        post.userId.notification.likeCommentShare
      ) {
        const payload = {
          to: post.userId.fcmToken,
          notification: {
            title: `${user.name} commented on your post.`,
          },
          data: {
            data: [
              {
                _id: post._id,
                caption: post.caption,
                like: post.like,
                comment: post.comment,
                post: post.post,
                date: post.date,
                allowComment: post.allowComment,
                userId: post.userId ? post.userId._id : "",
                name: post.userId ? post.userId.name : "",
                userImage: post.userId ? post.userId.image : "",
                isVIP: post.userId ? post.userId.isVIP : "",
                isLike: true,
                time: post.date ? post.date.split(",")[0] : "",
              },
            ],
            type: "POST",
          },
        };
        await fcm.send(payload, function (err, response) {
          if (err) {
            console.log("Something has gone wrong!", err);
          }
        });
      }
    } else {
      const video = await Video.findById(req.body.videoId).populate([
        {
          path: "userId",
          select: [
            "fcmToken",
            "name",
            "image",
            "isBlock",
            "notification",
            "isVIP",
          ],
        },
        { path: "song" },
      ]);
      if (!video) {
        return res
          .status(200)
          .json({ status: false, message: "Video does not Exist!" });
      }
      comment.video = video._id;
      video.comment += 1;
      await video.save();


      if (
        video.userId &&
        video.userId._id.toString() !== user._id.toString() &&
        !video.userId.isBlock &&
        video.userId.notification.likeCommentShare
      ) {
        const payload = {
          to: video.userId.fcmToken,
          notification: {
            title: `${user.name} commented on your Relite.`,
          },
          data: {
            data: [
              {
                _id: video._id,
                hashtag: video.hashtag,
                mentionPeople: video.mentionPeople,
                isOriginalAudio: video.isOriginalAudio,
                like: video.like,
                comment: video.comment,
                allowComment: video.allowComment,
                showVideo: video.showVideo,
                isDelete: video.isDelete,
                userId: video.userId ? video.userId._id : "",
                video: video.video,
                location: video.location,
                caption: video.caption,
                thumbnail: video.thumbnail,
                screenshot: video.screenshot,
                song: video.song,
                name: video.userId ? video.userId.name : "",
                userImage: video.userId ? video.userId.image : "",
                isVIP: video.userId ? video.userId.isVIP : false,
                isLike: true,
              },
            ],
            type: "RELITE",
          },
        };
        await fcm.send(payload, function (err, response) {
          if (err) {
            console.log("Something has gone wrong!", err);
          }
        });
      }
    }

    comment.userId = user._id;
    comment.comment = req.body.comment;

    await comment.save();

    return res.status(200).json({ status: true, message: "success", comment });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

//get list of comment
exports.getComment = async (req, res) => {
  try {
    if (req.query.postId) {
      const post = await Post.findById(req.query.postId);
      if (!post) {
        return res
          .status(200)
          .json({ status: false, message: "Post does not Exist!" });
      }
    } else {
      const video = await Video.findById(req.query.videoId);
      if (!video) {
        return res
          .status(200)
          .json({ status: false, message: "Relite does not Exist!" });
      }
    }

    let query;
    if (req.query.postId) {
      query = { post: mongoose.Types.ObjectId(req.query.postId) };
    } else {
      query = { video: mongoose.Types.ObjectId(req.query.videoId) };
    }

    const comment = await Comment.find({
      ...query,
    }).populate("userId");

    let now = dayjs();

    if (req.query.type === "ADMIN") {
      const comments = await comment.map((data) => ({
        _id: data._id,
        userId: data.userId ? data.userId._id : "",
        image: data.userId ? data.userId.image : "",
        name: data.userId ? data.userId.name : "",
        username: data.userId ? data.userId.username : "",
        isVIP: data.userId ? data.userId.isVIP : "",
        user: data.userId ? data.userId : null,
        comment: data.comment,
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
        .json({ status: true, message: "Success!!", data: comments });
    }

    const comment_ = await Comment.aggregate([
      {
        $match: { ...query },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userId",
        },
      },
      { $unwind: { path: "$userId", preserveNullAndEmptyArrays: true } },
      { $match: { "userId.isBlock": false } },
      { $sort: { createdAt: -1 } },
    ]);

    console.log("comment_", comment_);
    const comments = await comment_.map((data) => ({
      _id: data._id,
      userId: data.userId ? data.userId._id : "",
      image: data.userId ? data.userId.image : "",
      name: data.userId ? data.userId.name : "",
      username: data.userId ? data.userId.username : "",
      isVIP: data.userId ? data.userId.isVIP : "",
      comment: data.comment,
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
      .json({ status: true, message: "Success!!", data: comments });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

//destroy comment
exports.destroy = async (req, res) => {
  try {
    const comment = await Comment.findById(req.query.commentId);

    if (!comment) {
      return res
        .status(200)
        .json({ status: false, message: "Comment does not Exist!" });
    }

    if (comment.post !== null) {
      await Post.updateOne(
        { _id: comment.post },
        { $inc: { comment: -1 } }
      ).where({ comment: { $gt: 0 } });
    } else {
      await Video.updateOne(
        { _id: comment.video },
        { $inc: { comment: -1 } }
      ).where({ comment: { $gt: 0 } });
    }

    await comment.deleteOne();

    return res.status(200).json({ status: true, message: "Success!!" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};
