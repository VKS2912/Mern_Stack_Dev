const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = require("../../util/multer");

const PostController = require("./post.controller");
const upload = multer({
  storage,
});

const checkAccessWithKey = require("../../checkAccess");

// router.use(checkAccessWithKey());

// get all post [frontend]
router.get("/getPost", checkAccessWithKey(), PostController.index);

// get popular and latest post list
router.get(
  "/getPopularLatestPost",
  checkAccessWithKey(),
  PostController.getPopularLatestPosts
);

// get following post list
router.get(
  "/getFollowingPost",
  checkAccessWithKey(),
  PostController.getFollowingPosts
);

// get user post list
router.get("/user/post", checkAccessWithKey(), PostController.getUserPosts);

//create post
router.post(
  "/uploadPost",
  checkAccessWithKey(),
  upload.single("post"),
  PostController.uploadPost
);


// allow disallow comment on post [frontend]
router.patch(
  "/post/commentSwitch/:postId",
  checkAccessWithKey(),
  PostController.allowDisallowComment
);

// delete post
router.delete("/deletePost", checkAccessWithKey(), PostController.destroy);

//get post by identity
router.get("/postById", checkAccessWithKey(), PostController.getPostById);

module.exports = router;
