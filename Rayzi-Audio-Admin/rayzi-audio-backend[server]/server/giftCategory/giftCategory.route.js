const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = require("../../util/multer");

const CategoryController = require("./giftCategory.controller");
const upload = multer({
  storage,
});

const checkAccessWithKey = require("../../checkAccess");

// router.use(checkAccessWithKey());

// get category
router.get("/", checkAccessWithKey(), CategoryController.index);

//create category
router.post("/", checkAccessWithKey(), upload.single("image"), CategoryController.store);

//update category
router.patch("/:categoryId", checkAccessWithKey(), upload.single("image"), CategoryController.update);

//delete category
router.delete("/:categoryId", checkAccessWithKey(), CategoryController.destroy);

module.exports = router;
