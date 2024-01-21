const express = require("express");
const router = express.Router();

const WalletController = require("./wallet.controller");

const checkAccessWithKey = require("../../checkAccess");

// get income and outgoing total [diamond & rCoin]
router.get("/diamondRcoinTotal", checkAccessWithKey(), WalletController.incomeOutgoingDiamondRcoinTotal);

// get income and outgoing history [diamond & rCoin]
router.get("/diamondRcoinHistory", checkAccessWithKey(), WalletController.incomeOutgoingDiamondRcoinHistory);

// get all history of user [admin panel]
router.post("/history", checkAccessWithKey(), WalletController.history);

//get free diamond from watching ad
router.post("/income/seeAd", checkAccessWithKey(), WalletController.getDiamondFromAd);

// store call details when user do call
router.post("/call", checkAccessWithKey(), WalletController.call);

// convert rCoin to diamond
router.post("/convertRcoinToDiamond", checkAccessWithKey(), WalletController.convertRcoinToDiamond);

//send gift fake host [coin cut]
router.post("/sendGiftFakeHost",checkAccessWithKey(), WalletController.sendGiftFakeHost)
module.exports = router;
