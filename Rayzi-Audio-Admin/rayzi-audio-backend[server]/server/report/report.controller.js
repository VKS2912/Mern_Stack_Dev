const Report = require("./report.model");
const User = require("../user/user.model");

//reported user [to user]
exports.reportedUser = async (req, res) => {
  try {
    await Report.aggregate([
      {
        $sort: { date: -1 }
      },
      {
        $lookup: {
          from: "users",
          let: { fromUserIds: "$fromUserId", toUserIds: "$toUserId" },
          as: "toUserId",
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$toUserIds", "$_id"] }
              }
            },
            {
              $project: {
                name: 1,
                username: 1,
                image: 1,
                country: 1,
                rCoin: 1,
                diamond: 1
              }
            }
          ]
        }
      },
      {
        $unwind: {
          path: "$toUserId"
        }
      },
      { $group: { _id: "$fromUserId", count: { $sum: 1 }, report: { $push: "$$ROOT" } } },
    ]).exec(async (error, data) => {
      if (error) return res.status(200).json({ status: false, message: error.message || "Server Error" });
      else {
        const data_ = await Report.populate(data, [
          {
            path: "_id",
            model: "User",
            select: ["_id", "image", "name", "username", "country", "rCoin", "diamond"],
          },
        ]);
        return res.status(200).json({ status: true, message: "Success", report: data_ });
      }
    });

  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

exports.store = async (req, res) => {
  try {
    if (!req.body.fromUserId || !req.body.toUserId || !req.body.description)
      return res
        .status(200)
        .json({ status: false, message: "Invalid Details!!" });

    //from means live user id
    const fromUser = await User.findById(req.body.fromUserId);
    if (!fromUser)
      return res
        .status(200)
        .json({ status: false, message: "User does not Exist!!" });

    const toUser = await User.findById(req.body.toUserId);
    if (!toUser)
      return res
        .status(200)
        .json({ status: false, message: "User Does not Exist!" });

    const report = new Report();

    report.fromUserId = fromUser._id;
    report.toUserId = toUser._id;
    report.description = req.body.description;

    await report.save();

    return res.status(200).json({ status: true, message: "Success!!" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};
