const express = require("express");
const router = express.Router();

const SettingController = require("./setting.controller");

const checkAccessWithKey = require("../../checkAccess");

// store setting data
// router.post("/", checkAccessWithKey(), SettingController.store);

// get setting
router.get("/", SettingController.index)

// update setting
router.patch("/:settingId", SettingController.update);

router.put("/:settingId", SettingController.handleSwitch)

module.exports = router;
