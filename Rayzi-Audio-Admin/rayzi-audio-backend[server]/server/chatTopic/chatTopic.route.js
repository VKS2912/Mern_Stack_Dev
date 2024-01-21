const express = require("express");
const route = express.Router();

const checkAccessWithKey = require("../../checkAccess");

const ChatTopicController = require("./chatTopic.controller");

// get chat list
route.get("/chatList", checkAccessWithKey(), ChatTopicController.getChatList);

//create chat topic
route.post("/createRoom", checkAccessWithKey(), ChatTopicController.store);

module.exports = route;
