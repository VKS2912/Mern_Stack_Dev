const Favorite = require("./favorite.model");
const User = require("../user/user.model");
const Post = require("../post/post.model");
const Video = require("../video/video.model");
const dayjs = require("dayjs");

//FCM node
var FCM = require("fcm-node");
var config = require("../../config");
var fcm = new FCM(config.SERVER_KEY);

//like or unlike post and video
exports.likeUnlike = async (req, res, next) => {
  try {
    console.log("postId", req.body.postId);
    console.log("userId", req.body.userId);
    if (!req.body.userId)
      return res.status(200).json({
        status: false,
        message: "Invalid Details!",
      });

    if (!req.body.postId && !req.body.videoId)
      return res.status(200).json({
        status: false,
        message: "Invalid Details!",
      });

    const user = await User.findById(req.body.userId);

    if (!user)
      return res.status(200).json({
        status: false,
        message: "User does not Exist!",
      });

    console.log("User", user);

    //like or unlike post
    if (req.body.postId) {
      const post = await Post.findById(req.body.postId).populate(
        "userId",
        "fcmToken notification isBlock name image isVIP"
      );
      if (!post)
        return res.status(200).json({
          status: false,
          message: "Post does not Exist!",
        });

      console.log("Post", post);

      const likeExist = await Favorite.find({
        user: user._id,
        post: post._id,
      });
      const postDate = new Date(post.date);
     
      if (likeExist.length === 0) {
        const favorite = new Favorite();

        favorite.user = user._id;
        favorite.post = post._id;

        post.like += 1;

        await post.save();
        console.log("Like Done");

        await favorite.save(async (error, favorite) => {
          if (error)
            return res
              .status(200)
              .json({ status: false, error: error.message || "server error" });
          else {
            if (
              post.userId &&
              post.userId._id.toString() !== user._id.toString() &&
              !post.userId.isBlock &&
              post.userId.notification.likeCommentShare
            ) {
              const payload = {
                to: post.userId.fcmToken,
                notification: {
                  title: `${user.name} liked your post.`,
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
            return res.status(200).json({
              status: true,
              message: "Post Like Successfully!!",
              isLiked: true,
            });
          }
        });
      } else {
        await Post.updateOne({ _id: post._id }, { $inc: { like: -1 } }).where({
          like: { $gt: 0 },
        });
        await likeExist.map((data) => {
          data.deleteOne();
        });
        console.log("UnLike Done");
        return res.status(200).json({
          status: true,
          message: "Post Dislike Successfully!!",
          isLiked: false,
        });
      }
    }

    //like or unlike video
    if (req.body.videoId) {
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
      if (!video)
        return res.status(200).json({
          status: false,
          message: "Video does not Exist!",
        });

      const likeExist = await Favorite.find({
        user: user._id,
        video: video._id,
      });
      const videoDate = new Date(video.date);
    
      if (likeExist.length === 0) {
        const favorite = new Favorite();

        favorite.user = user._id;
        favorite.video = video._id;

        video.like += 1;
        await video.save();
          await favorite.save(async (error, favorite) => {
            if (error)
              return res.status(200).json({
                status: false,
                error: error.message || "server error",
              });
            else {
              if (
                video.userId &&
                video.userId._id.toString() !== user._id.toString() &&
                !video.userId.isBlock &&
                video.userId.notification.likeCommentShare
              ) {
                const payload = {
                  to: video.userId.fcmToken,
                  notification: {
                    title: `${user.name} liked your Relite.`,
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

              return res.status(200).json({
                status: true,
                message: "Relite Liked Successfully!!",
                isLiked: true,
              });
            }
          });
      } else {
        await Video.updateOne({ _id: video._id }, { $inc: { like: -1 } }).where(
          { like: { $gt: 0 } }
        );
        await likeExist.map((data) => {
          data.deleteOne();
        });
        return res.status(200).json({
          status: true,
          message: "Relite Unliked Successfully!!",
          isLiked: false,
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "server error" });
  }
};

//get list of likes
exports.getLikes = async (req, res) => {
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
      query = { post: req.query.postId };
    } else {
      query = { video: req.query.videoId };
    }

    const like = await Favorite.find({
      ...query,
    }).populate("user");

    let now = dayjs();

    if (req.query.type === "ADMIN") {
      const likes = await like.map((data) => ({
        _id: data._id,
        userId: data.user ? data.user._id : "",
        image: data.user ? data.user.image : "",
        name: data.user ? data.user.name : "",
        username: data.user ? data.user.username : "",
        comment: "",
        user: data.user ? data.user : null,
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
        .json({ status: true, message: "Success!!", data: likes });
    }

    const likes = await like.map((data) => ({
      _id: data._id,
      userId: data.user ? data.user._id : "",
      image: data.user ? data.user.image : "",
      name: data.user ? data.user.name : "",
      username: data.user ? data.user.username : "",
      comment: "",
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
      .json({ status: true, message: "Success!!", data: likes });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};
