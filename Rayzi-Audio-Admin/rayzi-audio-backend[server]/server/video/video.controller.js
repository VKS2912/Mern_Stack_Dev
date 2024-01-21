const Video = require("./video.model");
const User = require("../user/user.model");
const Hashtag = require("../hashtag/hashtag.model");
const Song = require("../song/song.model");
const Favorite = require("../favorite/favorite.model");
const Comment = require("../comment/comment.model");
const fs = require("fs");
const mongoose = require("mongoose");

const { deleteFile } = require("../../util/deleteFile");

const config = require("../../config");

// index
exports.index = async (req, res) => {
  try {
    if (req.query.userId) {
      const user = await User.findById(req.query.userId);
      if (!user) return res.status(200).json({ status: false, message: "User does not found!" });

      const video = await Video.find({
        userId: user._id,
        //isDelete: false,
      });
      return res.status(200).json({ status: true, message: "Success!!", video });
    }

    const start = req.query.start ? parseInt(req.query.start) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;

    let dateFilterQuery = {};
    if (req.query.startDate !== "ALL" && req.query.endDate !== "ALL") {
      dateFilterQuery = {
        analyticDate: { $gte: req.query.startDate, $lte: req.query.endDate },
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

    const video = await Video.aggregate([
      {
        $match: { isDelete: false, ...query },
      },
      {
        $addFields: {
          analyticDate: { $arrayElemAt: [{ $split: ["$date", ", "] }, 0] },
        },
      },
      {
        $match: dateFilterQuery,
      },
      {
        $sort: { date: -1 },
      },
      {
        $lookup: {
          from: "users",
          let: { userId: "$userId" },
          pipeline: [
            {
              $match: { $expr: { $eq: ["$$userId", "$_id"] } },
            },
            // {
            //   $project: {
            //     name: 1,
            //     username: 1,
            //     image: 1,
            //   },
            // },
          ],
          as: "userId",
        },
      },
      {
        $unwind: {
          path: "$userId",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "songs",
          let: { songId: "$song" },
          pipeline: [
            {
              $match: { $expr: { $eq: ["$$songId", "$_id"] } },
            },
            {
              $project: {
                song: 1,
              },
            },
          ],
          as: "song",
        },
      },
      {
        $unwind: {
          path: "$song",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $facet: {
          video: [
            { $skip: (start - 1) * limit }, // how many records you want to skip
            { $limit: limit },
          ],
          pageInfo: [
            { $group: { _id: null, totalRecord: { $sum: 1 } } }, // get total records count
          ],
        },
      },
    ]);

    return res.status(200).json({
      status: true,
      message: "Success!!",
      total: video[0].pageInfo.length > 0 ? video[0].pageInfo[0].totalRecord : 0,
      video: video[0].video,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, error: error.message || "Server Error" });
  }
};

// create video
exports.uploadVideo = async (req, res) => {
  try {
    if (!req.files.video || !req.body.userId || !req.files.screenshot)
      return res.status(200).json({ status: false, message: "Invalid Details!" });

    const user = await User.findById(req.body.userId);

    if (!user) {
      if (req.files.video) deleteFile(req.files.video[0]);
      if (req.files.screenshot) deleteFile(req.files.screenshot[0]);
      if (req.files.thumbnail) deleteFile(req.files.thumbnail[0]);
      return res.status(200).json({ status: false, message: "User does not found!" });
    }

    let song;

    if (req.body.songId) {
      song = await Song.findById(req.body.songId);

      if (!song) {
        if (req.files.video) deleteFile(req.files.video[0]);
        if (req.files.screenshot) deleteFile(req.files.screenshot[0]);
        if (req.files.thumbnail) deleteFile(req.files.thumbnail[0]);
        return res.status(200).json({ status: false, message: "Song does not found!" });
      }
    }

    var removeComa = req.body.hashtag.replace(/,\s*$/, "");

    var hashtagList = removeComa.split(",");

    if (hashtagList.length > 0) {
      hashtagList.map((hashtag) => {
        const h = hashtag.toLowerCase();
        if (h !== "" || h !== " ") {
          Hashtag.findOneAndUpdate({ hashtag: h }, {}, { upsert: true }, function (err) {
            // console.log(err)
          });
        }
      });
    }

    const video = new Video();

    video.userId = user._id;
    video.video = config.SERVER_PATH + req.files.video[0].path;
    video.hashtag = hashtagList;
    video.location = req.body.location;
    video.caption = req.body.caption;
    video.mentionPeople = req.body.mentionPeople;
    video.isOriginalAudio = req.body.isOriginalAudio;
    video.showVideo = parseInt(req.body.showVideo);
    video.allowComment = req.body.allowComment;
    video.duration = req.body.duration;
    video.size = req.body.size;
    video.thumbnail = req.files.thumbnail ? config.SERVER_PATH + req.files.thumbnail[0].path : null;
    video.screenshot = req.files.screenshot ? config.SERVER_PATH + req.files.screenshot[0].path : null;
    video.song = !song ? null : song._id;
    video.date = new Date().toLocaleString();
    await video.save();

    user.video += 1;
    await user.save();

    return res.status(200).json({ status: true, message: "Success!!" });
  } catch (error) {
    if (req.files.video) deleteFile(req.files.video[0]);
    if (req.files.screenshot) deleteFile(req.files.screenshot[0]);
    if (req.files.thumbnail) deleteFile(req.files.thumbnail[0]);
    console.log(error);
    return res.status(500).json({ status: false, error: error.message || "Server Error" });
  }
};


// get video list
exports.getVideo = async (req, res) => {
  try {
    const user = await User.findById(req.query.userId);
    if (!user) return res.status(200).json({ status: false, message: "User does not found!" });

    let query = {};
    if (req.query.type !== "ALL") {
      query = { userId: user._id };
    }

    const fakeVideo = await Video.aggregate([
      {
        $match: { ...query, isDelete: false, isFake: true },
      },
      {
        $lookup: {
          from: "favorites",
          let: {
            videoId: "$_id",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$video", "$$videoId"] }, { $eq: ["$user", user._id] }],
                },
              },
            },
          ],
          as: "favorite",
        },
      },
      {
        $unwind: {
          path: "$favorite",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: false,
        },
      },
      { $match: { "user.isBlock": false } },
      {
        $sort: { date: -1 },
      },
      {
        $project: {
          userId: "$user._id",
          name: "$user.name",
          userImage: "$user.image",
          isVIP: "$user.isVIP",
          isOriginalAudio: 1,
          like: 1,
          comment: 1,
          allowComment: 1,
          showVideo: 1,
          userId: 1,
          video: 1,
          isFake: 1,
          location: 1,
          caption: 1,
          thumbnail: 1,
          screenshot: 1,
          isDelete: 1,
          isLike: {
            $cond: [{ $eq: [user._id, "$favorite.user"] }, true, false],
          },
          hashtag: 1,
          mentionPeople: 1,
          song: null,
        },
      },
      {
        $facet: {
          video: [
            { $skip: req.query.start ? parseInt(req.query.start) : 0 }, // how many records you want to skip
            { $limit: req.query.limit ? parseInt(req.query.limit) : 20 },
          ],
        },
      },
    ]);

    const video = await Video.aggregate([
      {
        $match: { ...query, isDelete: false, isFake: false },
      },
      {
        $lookup: {
          from: "favorites",
          let: {
            videoId: "$_id",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$video", "$$videoId"] }, { $eq: ["$user", user._id] }],
                },
              },
            },
          ],
          as: "favorite",
        },
      },
      {
        $unwind: {
          path: "$favorite",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "songs",
          localField: "song",
          foreignField: "_id",
          as: "song",
        },
      },
      {
        $unwind: {
          path: "$song",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: false,
        },
      },
      { $match: { "user.isBlock": false } },
      {
        $sort: { date: -1 },
      },
      {
        $project: {
          userId: "$user._id",
          name: "$user.name",
          userImage: "$user.image",
          isVIP: "$user.isVIP",
          isOriginalAudio: 1,
          like: 1,
          comment: 1,
          allowComment: 1,
          showVideo: 1,
          userId: 1,
          video: 1,
          isFake: 1,
          location: 1,
          caption: 1,
          thumbnail: 1,
          screenshot: 1,
          isDelete: 1,
          isLike: {
            $cond: [{ $eq: [user._id, "$favorite.user"] }, true, false],
          },
          hashtag: 1,
          mentionPeople: 1,
          song: { $ifNull: ["$song", null] },
        },
      },
      {
        $facet: {
          video: [
            { $skip: req.query.start ? parseInt(req.query.start) : 0 }, // how many records you want to skip
            { $limit: req.query.limit ? parseInt(req.query.limit) : 20 },
          ],
        },
      },
    ]);

      return res.status(200).json({
        status: true,
        message: "Success!!",
        video: video[0].video.length > 0 ? video[0].video : [],
      });
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, error: error.message || "Server Error" });
  }
};

// get video by id
exports.getVideoById = async (req, res) => {
  try {
    const video = await Video.aggregate([
      {
        $match: { _id: mongoose.Types.ObjectId(req.query.videoId) },
      },
      {
        $lookup: {
          from: "favorites",
          let: {
            videoId: "$_id",
            userId: "$userId",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$video", "$$videoId"] }, { $eq: ["$user", "$$userId"] }],
                },
              },
            },
          ],
          as: "favorite",
        },
      },
      {
        $unwind: {
          path: "$favorite",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "songs",
          localField: "song",
          foreignField: "_id",
          as: "song",
        },
      },
      {
        $unwind: {
          path: "$song",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: false,
        },
      },
      { $match: { "user.isBlock": false } },
      {
        $sort: { date: -1 },
      },
      {
        $project: {
          userId: "$user._id",
          name: "$user.name",
          userImage: "$user.image",
          isVIP: "$user.isVIP",
          isOriginalAudio: 1,
          like: 1,
          comment: 1,
          allowComment: 1,
          showVideo: 1,
          userId: 1,
          video: 1,
          location: 1,
          caption: 1,
          thumbnail: 1,
          screenshot: 1,
          isDelete: 1,
          isLike: {
            $cond: [{ $eq: ["$user._id", "$favorite.user"] }, true, false],
          },
          hashtag: 1,
          mentionPeople: 1,
          song: { $ifNull: ["$song", null] },
        },
      },
      {
        $facet: {
          video: [
            { $skip: req.query.start ? parseInt(req.query.start) : 0 }, // how many records you want to skip
            { $limit: req.query.limit ? parseInt(req.query.limit) : 20 },
          ],
        },
      },
    ]);

    return res.status(200).json({
      status: video[0].video.length > 0 ? true : false,
      message: video[0].video.length > 0 ? "Success!!" : "Video does not Exist !",
      video: video[0].video.length > 0 ? video[0].video : [],
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, error: error.message || "Server Error" });
  }
};

// delete video
exports.destroy = async (req, res) => {
  try {
    const video = await Video.findById(req.query.videoId);
    if (!video) return res.status(200).json({ status: false, message: "Video does not Exist!" });

    if (fs.existsSync(video.video)) {
      fs.unlinkSync(video.video);
    }
    if (fs.existsSync(video.thumbnail)) {
      fs.unlinkSync(video.thumbnail);
    }
    if (fs.existsSync(video.screenshot)) {
      fs.unlinkSync(video.screenshot);
    }

    await Comment.deleteMany({ video: video._id });
    await Favorite.deleteMany({ video: video._id });

    video.comment = 0;
    video.like = 0;

    video.isDelete = true;
    await video.save();

    return res.status(200).json({ status: true, message: "Success!!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, error: error.message || "Server Error" });
  }
};

// allow disallow comment on relite [frontend]
exports.allowDisallowComment = async (req, res) => {
  try {
    const video = await Video.findById(req.params.videoId).populate("userId song");
    if (!video) return res.status(200).json({ status: false, message: "Video does not Exist!" });

    video.allowComment = !video.allowComment;
    await video.save();

    return res.status(200).json({ status: true, message: "Success!!", video });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, error: error.message || "Server Error" });
  }
};
