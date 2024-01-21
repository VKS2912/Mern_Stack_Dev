const express = require("express");
const router = express.Router();

const multer = require("multer");
const storage = require("../../util/multer");

const SongController = require("./song.controller");

const upload = multer({
  storage,
});

const checkAccessWithKey = require("../../checkAccess");

// router.use(checkAccessWithSecretKey());

//get song list
router.get("/", checkAccessWithKey(), SongController.index);

//create song
router.post(
  "/", checkAccessWithKey(),
  upload.fields([{ name: "image" }, { name: "song" }]),
  SongController.store
);

//update song
router.patch(
  "/:songId", checkAccessWithKey(),
  upload.fields([{ name: "image" }, { name: "song" }]),
  SongController.update
);

//delete song
router.delete("/:songId", checkAccessWithKey(), SongController.destroy);

module.exports = router;
