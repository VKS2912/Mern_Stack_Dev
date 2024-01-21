const express = require("express");
const router = express.Router();

const VIPPlanController = require("./vipPlan.controller");

const checkAccessWithKey = require("../../checkAccess");

// router.use(checkAccessWithKey());

// get vip plans
router.get("/", checkAccessWithKey(), VIPPlanController.index);

// get purchase plan history
router.get("/history", checkAccessWithKey(), VIPPlanController.purchaseHistory);

//create vip plan
router.post("/", checkAccessWithKey(), VIPPlanController.store);

// purchase plan through stripe
router.post("/purchase/stripe", VIPPlanController.payStripe);

// purchase plan through google play
router.post("/purchase/googlePlay", VIPPlanController.payGooglePlay);

//update vip plan
router.patch("/:planId", checkAccessWithKey(), VIPPlanController.update);

//switch for renew plan
router.put("/:planId", checkAccessWithKey(), VIPPlanController.renewalSwitch);

//delete vip plan
router.delete("/:planId", checkAccessWithKey(), VIPPlanController.destroy);

module.exports = router;
