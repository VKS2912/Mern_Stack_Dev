const express = require("express");
const router = express.Router();

const AdvertisementController = require("./advertisement.controller");

const checkAccessWithKey = require("../../checkAccess");

//for android and backend
router.get("/", checkAccessWithKey(), AdvertisementController.googleAd);

router.post("/", checkAccessWithKey(), AdvertisementController.store);

router.patch("/:adId", checkAccessWithKey(), AdvertisementController.update);

router.put("/:adId", checkAccessWithKey(), AdvertisementController.showToggle);

module.exports = router;
