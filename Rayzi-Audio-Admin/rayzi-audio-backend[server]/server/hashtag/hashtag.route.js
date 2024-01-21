const express = require("express");
const router = express.Router();

const HashtagController = require("./hashtag.controller");

const checkAccessWithKey = require("../../checkAccess");

// router.use(checkAccessWithKey());

// get hashtag list + search [for android]
router.get("/", checkAccessWithKey(), HashtagController.index);

// create hashtag
router.post("/", checkAccessWithKey(), HashtagController.store);

// update hashtag
router.patch("/:hashtagId", checkAccessWithKey(), HashtagController.update)

// delete hashtag
router.delete("/:hashtagId", checkAccessWithKey(), HashtagController.destroy)


module.exports = router;
