const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = require("../../util/multer");

const ThemeController = require("./theme.controller");
const upload = multer({
  storage,
});

const checkAccessWithKey = require("../../checkAccess");

// get all sticker
router.get("/", checkAccessWithKey(), ThemeController.index);

//create sticker
router.post("/", checkAccessWithKey(), upload.any(), ThemeController.store);

// update sticker
router.patch(
  "/:themeId",
  checkAccessWithKey(),
  upload.single("theme"),
  ThemeController.update
);

// delete sticker
router.delete("/:themeId", checkAccessWithKey(), ThemeController.destroy);

module.exports = router;
