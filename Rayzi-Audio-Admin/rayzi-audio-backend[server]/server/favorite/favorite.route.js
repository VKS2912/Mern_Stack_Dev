const express = require("express");
const router = express.Router();

const FavoriteController = require("./favorite.controller");

var checkAccessWithKey = require("../../checkAccess");

// get likes list
router.get("/likes", checkAccessWithKey(), FavoriteController.getLikes)

//like or unlike post and video
router.post("/likeUnlike", checkAccessWithKey(), FavoriteController.likeUnlike);

module.exports = router;
