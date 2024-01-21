const User = require("../user/user.model");

// handle user notification true/false
exports.handleNotification = async (req, res) => {
  try {
    const user = await User.findById(req.body.userId).populate("level");

    if (!user)
      return res
        .status(200)
        .json({ status: false, message: "User does not Exist!", user: {} });

    if (req.body.type === "newFollow") {
      user.notification.newFollow = !user.notification.newFollow;
    }
    if (req.body.type === "favoriteLive") {
      user.notification.favoriteLive = !user.notification.favoriteLive;
    }
    if (req.body.type === "likeCommentShare") {
      user.notification.likeCommentShare = !user.notification.likeCommentShare;
    }
    if (req.body.type === "message") {
      user.notification.message = !user.notification.message;
    }

    await user.save();

    return res.status(200).json({ status: true, message: "Success!!", user });
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      status: false,
      error: error.message || "Server Error",
      user: "",
    });
  }
};
