const express = require("express");
const multer = require("multer");
const router = express.Router();
const storage = require("../../util/multer");
const upload = multer({
  storage,
});

const ComplainController = require("./complain.controller");

var checkAccessWithKey = require("../../checkAccess");

//store complain
router.post("/", checkAccessWithKey(), upload.single("image"), ComplainController.store);

//get user complain list [admin panel]
router.get("/", checkAccessWithKey(), ComplainController.complainList);

//get user complain [for android]
router.get("/userList", checkAccessWithKey(), ComplainController.userComplainList);

//solve complain
router.patch("/:complainId", checkAccessWithKey(), ComplainController.solveComplain);

module.exports = router;
