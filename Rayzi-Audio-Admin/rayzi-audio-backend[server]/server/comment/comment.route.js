const express = require("express");
const router = express.Router();

const CommentController = require("./comment.controller");

var checkAccessWithKey = require("../../checkAccess");

// router.use(checkAccessWithSecretKey());

//create comment
router.post("/", checkAccessWithKey(), CommentController.store);

// get comment list
router.get("/", checkAccessWithKey(), CommentController.getComment);

// delete comment
router.delete("/", checkAccessWithKey(), CommentController.destroy);

module.exports = router;
