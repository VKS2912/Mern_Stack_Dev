const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = require("../../util/multer");

const UserController = require("./user.controller");
const upload = multer({
  storage,
});

const checkAccessWithKey = require("../../checkAccess");

// router.use(checkAccessWithKey());

// get user list
router.get("/getUsers", checkAccessWithKey(), UserController.index);

// get popular user by followers
router.get(
  "/getPopularUser",
  checkAccessWithKey(),
  UserController.getPopularUser
);

// get profile of user who login
router.get("/user/profile", checkAccessWithKey(), UserController.getProfile);

// get random match for call
router.get("/user/random", checkAccessWithKey(), UserController.randomMatch);

// online the user
router.post("/user/online", UserController.userIsOnline);

// search user by name and username
router.post("/user/search", checkAccessWithKey(), UserController.search);

// get user profile of post[feed]
router.post("/getUser", checkAccessWithKey(), UserController.getProfileUser);

//user login and signup
router.post("/loginSignup", checkAccessWithKey(), UserController.loginSignup);

// check username is already exist or not
router.post(
  "/checkUsername",
  checkAccessWithKey(),
  UserController.checkUsername
);

// check referral code is valid and add referral bonus
router.post(
  "/addReferralCode",
  checkAccessWithKey(),
  UserController.referralCode
);

// admin add or less the rCoin or diamond of user through admin panel
router.post(
  "/user/addLessCoin",
  checkAccessWithKey(),
  UserController.addLessRcoinDiamond
);

// update user detail [android]
router.post(
  "/user/update",
  checkAccessWithKey(),
  upload.single("image"),
  UserController.updateProfile
);

// bock unblock user
router.patch(
  "/blockUnblock/:userId",
  checkAccessWithKey(),
  UserController.blockUnblock
);

router.patch("/IdGenerate", checkAccessWithKey(), UserController.IdGenerate);

module.exports = router;
