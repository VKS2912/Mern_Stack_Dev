const express = require("express");
const router = express.Router();

const ReportController = require("./report.controller");

var checkAccessWithKey = require("../../checkAccess");

router.get("/", checkAccessWithKey(), ReportController.reportedUser);

router.post("/", checkAccessWithKey(), ReportController.store);

module.exports = router;
