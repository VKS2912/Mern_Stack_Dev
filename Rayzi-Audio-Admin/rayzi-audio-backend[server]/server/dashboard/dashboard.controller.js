const User = require("../user/user.model");
const LiveUser = require("../liveUser/liveUser.model");
const LiveStreamingHistory = require("../liveStreamingHistory/liveStreamingHistory.model");
const VIPPlanHistory = require("../vipPlan/vipPlanHistory.model");
const Report = require("../report/report.model");
const Post = require("../post/post.model");
const Video = require("../video/video.model");
const VIPPlan = require("../vipPlan/vipPlan.model");
const CoinPlan = require("../coinPlan/coinPlan.model");

exports.dashboard = async (req, res) => {
  try {
    const totalUser = await User.find().countDocuments();
    const activeUser = await User.find({ isOnline: true }).countDocuments();
    const vipUser = await User.find({ isVIP: true }).countDocuments();
    const liveUser = await LiveUser.find().countDocuments();
    const post = await Post.find().countDocuments();
    const video = await Video.find().countDocuments();
    const report = await Report.find().countDocuments();

    // coin plan revenue
    const coinRevenue = await CoinPlan.aggregate([
      {
        $lookup: {
          from: "wallets",
          let: { planIds: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$type", 2] },
                    { $eq: ["$planId", "$$planIds"] },
                  ],
                },
              },
            },
          ],
          as: "plan",
        },
      },
      {
        $unwind: {
          path: "$plan",
        },
      },
      {
        $group: {
          _id: null,
          dollar: { $sum: "$dollar" },
          rupee: { $sum: "$rupee" },
        },
      },
    ]);

    // vip plan revenue
    const vipRevenue = await VIPPlan.aggregate([
      {
        $lookup: {
          from: "vipplanhistories",
          let: { planIds: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$planId", "$$planIds"] },
              },
            },
          ],
          as: "plan",
        },
      },
      {
        $unwind: {
          path: "$plan",
        },
      },
      {
        $group: {
          _id: null,
          dollar: { $sum: "$dollar" },
          rupee: { $sum: "$rupee" },
        },
      },
    ]);

    const dashboard = {
      totalUser,
      activeUser,
      vipUser,
      liveUser,
      post,
      video,
      report,
      revenue: {
        dollar:
          (coinRevenue.length > 0 ? coinRevenue[0].dollar : 0) +
          (vipRevenue.length > 0 ? vipRevenue[0].dollar : 0),
        rupee:
          (coinRevenue.length > 0 ? coinRevenue[0].rupee : 0) +
          (vipRevenue.length > 0 ? vipRevenue[0].rupee : 0),
      },
    };

    return res
      .status(200)
      .json({ status: true, message: "Success!!", dashboard });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

exports.analytic = async (req, res) => {
  try {
    if (req.query.startDate !== "ALL" && req.query.endDate !== "ALL") {
      sDate = req.query.startDate + "T00:00:00.000Z";
      eDate = req.query.endDate + "T00:00:00.000Z";

      //for date query

      dateFilterQuery = {
        analytic: {
          $gte: new Date(sDate),
          $lte: new Date(eDate),
        },
      };
      console.log(dateFilterQuery, "dateFilterQuery");
    }

    if (req.query.type === "USER") {
      const user = await User.aggregate([
        {
          $addFields: {
            analytic: {
              $toDate: {
                $arrayElemAt: [{ $split: ["$analyticDate", ", "] }, 0],
              },
            },
          },
        },
        {
          $match: dateFilterQuery,
        },
        { $group: { _id: "$analytic", count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]);

      return res
        .status(200)
        .json({ status: true, message: "Success!!", analytic: user });
    }

    if (req.query.type === "LIVE USER") {
      const user = await LiveStreamingHistory.aggregate([
        {
          $addFields: {
            analytic: {
              $toDate: {
                $arrayElemAt: [{ $split: ["$startTime", ", "] }, 0],
              },
            },
          },
        },
        {
          $match: dateFilterQuery,
        },
        {
          $group: {
            _id: { id: "$userId", time: "$analytic" },
            doc: { $first: "$$ROOT" },
          },
        },
        {
          $replaceRoot: { newRoot: "$doc" },
        },
        { $group: { _id: "$analytic", count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]);

      return res
        .status(200)
        .json({ status: true, message: "Success!!", analytic: user });
    }

    if (req.query.type === "VIP") {
      const user = await VIPPlanHistory.aggregate([
        {
          $addFields: {
            analytic: {
              $toDate: {
                $arrayElemAt: [{ $split: ["$date", ", "] }, 0],
              },
            },
          },
        },
        {
          $match: dateFilterQuery,
        },
        { $group: { _id: "$analytic", count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]);

      return res
        .status(200)
        .json({ status: true, message: "Success!!", analytic: user });
    }

    if (req.query.type === "POST") {
      const user = await Post.aggregate([
        {
          $addFields: {
            analytic: {
              $toDate: {
                $arrayElemAt: [{ $split: ["$date", ", "] }, 0],
              },
            },
          },
        },
        {
          $match: dateFilterQuery,
        },
        { $group: { _id: "$analytic", count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]);

      return res
        .status(200)
        .json({ status: true, message: "Success!!", analytic: user });
    }

    if (req.query.type === "VIDEO") {
      const user = await Video.aggregate([
        {
          $addFields: {
            analytic: {
              $toDate: {
                $arrayElemAt: [{ $split: ["$date", ", "] }, 0],
              },
            },
          },
        },
        {
          $match: dateFilterQuery,
        },
        { $group: { _id: "$analytic", count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]);

      return res
        .status(200)
        .json({ status: true, message: "Success!!", analytic: user });
    }

    if (req.query.type === "REPORT") {
      const user = await Report.aggregate([
        {
          $addFields: {
            analytic: {
              $toDate: {
                $arrayElemAt: [{ $split: ["$date", ", "] }, 0],
              },
            },
          },
        },
        {
          $match: dateFilterQuery,
        },
        { $group: { _id: "$analytic", count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]);

      return res
        .status(200)
        .json({ status: true, message: "Success!!", analytic: user });
    }

    if (req.query.type === "REVENUE") {
      // coin plan revenue
      const coinRevenue = await CoinPlan.aggregate([
        {
          $lookup: {
            from: "wallets",
            let: { planIds: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$type", 2] },
                      { $eq: ["$planId", "$$planIds"] },
                    ],
                  },
                },
              },
              {
                $addFields: {
                  analytic: {
                    $toDate: {
                      $arrayElemAt: [{ $split: ["$date", ", "] }, 0],
                    },
                  },
                },
              },
              {
                $match: dateFilterQuery,
              },
            ],
            as: "plan",
          },
        },
        {
          $unwind: {
            path: "$plan",
          },
        },
        {
          $group: {
            _id: "$plan.analytic",
            dollar: { $sum: "$dollar" },
            rupee: { $sum: "$rupee" },
          },
        },
      ]);

      // vip plan revenue
      const vipRevenue = await VIPPlan.aggregate([
        {
          $lookup: {
            from: "vipplanhistories",
            let: { planIds: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$planId", "$$planIds"] },
                },
              },
              {
                $addFields: {
                  analytic: {
                    $toDate: {
                      $arrayElemAt: [{ $split: ["$date", ", "] }, 0],
                    },
                  },
                },
              },
              {
                $match: dateFilterQuery,
              },
            ],
            as: "plan",
          },
        },
        {
          $unwind: {
            path: "$plan",
          },
        },
        {
          $group: {
            _id: "$plan.analytic",
            dollar: { $sum: "$dollar" },
            rupee: { $sum: "$rupee" },
          },
        },
      ]);

      return res.status(200).json({
        status: true,
        message: "Success!!",
        analytic: [{ coinRevenue, vipRevenue }],
      });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};
