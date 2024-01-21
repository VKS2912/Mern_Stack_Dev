const VIPPlan = require("./vipPlan.model");
const VIPPlanHistory = require("./vipPlanHistory.model");
const User = require("../user/user.model");
const Setting = require("../setting/setting.model");

//google play
const Verifier = require("google-play-billing-validator");

//get vip plans
exports.index = async (req, res) => {
  try {
    const vipPlan = await VIPPlan.find({ isDelete: false }).sort({
      validityType: 1,
      validity: 1,
    });

    if (!vipPlan)
      return res.status(200).json({ status: false, message: "No data found!" });

    return res
      .status(200)
      .json({ status: true, message: "Success!!", vipPlan });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

// create vip plan
exports.store = async (req, res) => {
  try {
    if (
      !req.body.validity ||
      !req.body.validityType ||
      !req.body.dollar ||
      !req.body.rupee ||
      !req.body.productKey
    )
      return res
        .status(200)
        .json({ status: false, message: "Invalid Details!" });

    const vipPlan = new VIPPlan();

    vipPlan.name = req.body.name;
    vipPlan.validity = req.body.validity;
    vipPlan.validityType = req.body.validityType;
    vipPlan.dollar = req.body.dollar;
    vipPlan.rupee = req.body.rupee;
    vipPlan.tag = req.body.tag;
    vipPlan.productKey = req.body.productKey;

    await vipPlan.save();

    return res.status(200).json({ status: true, message: "Success!", vipPlan });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

// update vip plan
exports.update = async (req, res) => {
  try {
    const vipPlan = await VIPPlan.findById(req.params.planId);

    if (!vipPlan) {
      return res
        .status(200)
        .json({ status: false, message: "Plan does not Exist!" });
    }

    if (req.body.name) {
      vipPlan.name = req.body.name;
    }

    vipPlan.validity = req.body.validity;
    vipPlan.validityType = req.body.validityType;
    vipPlan.dollar = req.body.dollar;
    vipPlan.rupee = req.body.rupee;
    vipPlan.tag = req.body.tag;
    vipPlan.productKey = req.body.productKey;

    await vipPlan.save();

    return res.status(200).json({ status: true, message: "Success!", vipPlan });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

// delete vipPlan
exports.destroy = async (req, res) => {
  try {
    const vipPlan = await VIPPlan.findById(req.params.planId);

    if (!vipPlan)
      return res
        .status(200)
        .json({ status: false, message: "Plan does not Exist!" });

    vipPlan.isDelete = true;

    await vipPlan.save();

    return res.status(200).json({ status: true, message: "Success!" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

//auto renewal switch
exports.renewalSwitch = async (req, res) => {
  try {
    const vipPlan = await VIPPlan.findById(req.params.planId);

    if (!vipPlan)
      return res
        .status(200)
        .json({ status: false, message: "Plan does not Exist!" });

    vipPlan.isAutoRenew = !vipPlan.isAutoRenew;
    await vipPlan.save();

    return res.status(200).json({ status: true, message: "Success!", vipPlan });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

//add plan through stripe API
exports.payStripe = async (req, res) => {
  try {
    console.log("body", req.body);
    if (req.body.userId && req.body.planId && req.body.currency) {
      const user = await User.findById(req.body.userId).populate("level");
      if (!user) {
        return res.send({
          status: false,
          message: "User does not exist!!",
          user: "",
        });
      }

      const plan = await VIPPlan.findById(req.body.planId);

      console.log("plan._id", plan._id);
      if (!plan) {
        return res.send({
          status: false,
          message: "Plan does not exist!!",
          user: "",
        });
      }
      const setting = await Setting.findOne({});
      const stripe = require("stripe")(setting ? setting.stripeSecretKey : "");

      let intent;
      if (req.body.payment_method_id) {
        // Create the PaymentIntent
        intent = await stripe.paymentIntents.create({
          payment_method: req.body.payment_method_id,
          amount:
            req.body.currency === "inr" ? plan.rupee * 100 : plan.dollar * 100,
          currency: req.body.currency,
          confirmation_method: "manual",
          confirm: true,
        });
      } else if (req.body.payment_intent_id) {
        intent = await stripe.paymentIntents.confirm(
          req.body.payment_intent_id
        );
      }

      // Send the response to the client
      if (
        intent !== undefined &&
        intent.status === "requires_action" &&
        intent.next_action.type === "use_stripe_sdk"
      ) {
        // Tell the client to handle the action
        return res.send({
          status: true,
          requires_action: true,
          payment_intent_client_secret: intent.client_secret,
        });
      } else if (intent !== undefined && intent.status === "succeeded") {
        // The payment didn’t need any additional actions and completed!
        // Handle post-payment fulfillment
        user.isVIP = true;
        user.plan.planStartDate = new Date().toLocaleString();
        user.plan.planId = plan._id;
        await user.save();

        const history = new VIPPlanHistory();
        history.userId = user._id;
        history.planId = plan._id;
        history.paymentGateway = "Stripe";
        history.date = new Date().toLocaleString();

        await history.save();

        return res.send({
          status: true,
          message: "Success!!",
          user,
        });
      } else {
        // Invalid status
        return res.send({
          status: false,
          message: "Invalid PaymentIntent status",
          user: "",
        });
      }
    } else {
      return res.send({
        status: false,
        message: "Invalid Details!",
        user: null,
      });
    }
  } catch (e) {
    console.log(e);
    // Display error on client
    return res.send({ status: false, error: e.message, user: {} });
  }
};

//add plan through google play
exports.payGooglePlay = async (req, res) => {
  try {
    if (
      !req.body.packageName &&
      !req.body.token &&
      !req.body.productId &&
      !req.body.userId &&
      !req.body.planId
    )
      return res
        .status(200)
        .json({ status: false, message: "Invalid Details!", user: {} });

    const user = await User.findById(req.body.userId).populate("level");

    if (!user) {
      return res
        .status(200)
        .json({ status: false, message: "User does not Exist!", user: {} });
    }

    const plan = await VIPPlan.findById(req.body.planId);
    if (!plan) {
      return res
        .status(200)
        .json({ status: false, message: "Plan does not Exist!", user: {} });
    }

    const setting = await Setting.findOne({});

    const options = {
      email: setting ? setting.googlePlayEmail : "",
      key: setting ? setting.googlePlayKey : "",
    };

    const verifier = new Verifier(options);

    var packageName = req.body.packageName;
    var token = req.body.token;
    var productId = req.body.productId;
    let receipt = {
      packageName,
      productId, // sku = productId subscription id
      purchaseToken: token,
    };

    let promiseData = await verifier.verifyINAPP(receipt);

    if (promiseData.isSuccessful) {
      user.isVIP = true;
      user.plan.planStartDate = new Date().toLocaleString();
      user.plan.planId = plan._id;
      await user.save();

      const history = new VIPPlanHistory();
      history.userId = user._id;
      history.planId = plan._id;
      history.paymentGateway = "Google Play";
      history.date = new Date().toLocaleString();
      await history.save();

      return res.status(200).json({ status: true, message: "success", user });
    } else {
      return res
        .status(200)
        .json({ status: false, message: promiseData.errorMessage, user: {} });
    }
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      status: false,
      message: error.errorMessage || "Server Error",
      user: "",
    });
  }
};

// get purchase plan history of user
exports.purchaseHistory = async (req, res) => {
  try {
    let matchQuery = {};
    if (req.query.userId) {
      const user = await User.findById(req.query.userId);

      if (!user)
        return res
          .status(200)
          .json({ status: false, message: "User does not Exist!!" });

      matchQuery = { userId: user._id };
    }

    const start = req.query.start ? parseInt(req.query.start) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;

    const addFieldQuery = {
      shortDate: {
        $toDate: { $arrayElemAt: [{ $split: ["$date", ", "] }, 0] },
      },
    };

    let dateFilterQuery = {};

    if (req.query.startDate !== "ALL" && req.query.endDate !== "ALL") {
      dateFilterQuery = {
        shortDate: { $gte: new Date(req.query.startDate), $lte: new Date(req.query.endDate) },
      };
    }

    const history = await VIPPlanHistory.aggregate([
      {
        $match: matchQuery,
      },
      {
        $addFields: addFieldQuery,
      },
      { $sort: { shortDate: -1 } },
      {
        $match: dateFilterQuery,
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
      {
        $lookup: {
          from: "vipplans",
          localField: "planId",
          foreignField: "_id",
          as: "plan",
        },
      },
      {
        $unwind: {
          path: "$plan",
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $project: {
          paymentGateway: 1,
          name: "$user.name",
          dollar: "$plan.dollar",
          rupee: "$plan.rupee",
          validity: "$plan.validity",
          validityType: "$plan.validityType",
          purchaseDate: "$date",
        },
      },
      {
        $facet: {
          history: [
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
      total:
        history[0].pageInfo.length > 0 ? history[0].pageInfo[0].totalRecord : 0,
      history: history[0].history,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};
