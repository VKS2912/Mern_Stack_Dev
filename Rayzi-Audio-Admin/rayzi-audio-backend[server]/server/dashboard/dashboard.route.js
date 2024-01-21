const express = require("express");
const router = express.Router();

const DashboardController = require("./dashboard.controller");

var checkAccessWithKey = require("../../checkAccess");

// get dashboard
router.get("/", checkAccessWithKey(), DashboardController.dashboard);

// analytic
router.get("/analytic", checkAccessWithKey(), DashboardController.analytic)

module.exports = router;
