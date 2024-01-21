//express
const express = require("express");
const route = express.Router();

//authentication access
const checkAccessWithKey = require("../../checkAccess");

//Controller
const ChatController = require("./chat.controller");

//multer
const multer = require("multer");
const storage = require("../../util/multer");
const router = require("../setting/setting.route");
const upload = multer({
  storage,
});

//Get Route Of Chat
route.get("/getOldChat", checkAccessWithKey(), ChatController.getOldChat);

//create chat-topic
route.post(
  "/uploadImage",
  checkAccessWithKey(),
  upload.single("image"),
  ChatController.store
);

// delete message
route.delete("/deleteMessage", checkAccessWithKey(), ChatController.deleteMessage);

module.exports = route;
