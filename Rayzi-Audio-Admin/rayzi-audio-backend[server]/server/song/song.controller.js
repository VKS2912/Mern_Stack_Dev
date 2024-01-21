const Song = require("./song.model");
const fs = require("fs");
const { deleteFile } = require("../../util/deleteFile");
const { compressImage } = require("../../util/compressImage");

// get song list
exports.index = async (req, res) => {
  try {
    const song = await Song.find({ isDelete: false }).sort({ createdAt: -1 });

    if (!song)
      return res.status(200).json({ status: false, message: "No data found!" });

    return res.status(200).json({ status: true, message: "Success!!", song });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

// create song
exports.store = async (req, res) => {
  try {
    if (
      !req.body.title ||
      !req.body.singer ||
      !req.files.song ||
      !req.files.image
    ) {
      if (req.files.song) deleteFile(req.files.song[0]);
      if (req.files.image) deleteFile(req.files.image[0]);
      return res
        .status(200)
        .json({ status: false, message: "Invalid Details!" });
    }

    // compress image
    compressImage(req.files.image[0]);

    const song = new Song();

    song.title = req.body.title;
    song.singer = req.body.singer;
    song.image = req.files.image[0].path;
    song.song = req.files.song[0].path;

    await song.save();

    return res.status(200).json({ status: true, message: "Success!!", song });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

// update song
exports.update = async (req, res) => {
  try {
    const songs = await Song.findById(req.params.songId);

    if (!songs)
      return res
        .status(200)
        .json({ status: false, message: "Song does not Exist!" });

    if (req.files.song) {
      if (fs.existsSync(songs.song)) {
        fs.unlinkSync(songs.song);
      }
      songs.song = req.files.song[0].path;
    }
    if (req.files.image) {
      if (fs.existsSync(songs.image)) {
        fs.unlinkSync(songs.image);
      }
      // compress image
      compressImage(req.files.image[0]);
      songs.image = req.files.image[0].path;
    }

    songs.title = req.body.title;
    songs.singer = req.body.singer;

    await songs.save();

    return res.status(200).json({ status: true, message: "Success!!", song: songs });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

// delete song
exports.destroy = async (req, res) => {
  try {
    const song = await Song.findById(req.params.songId);

    if (!song)
      return res
        .status(200)
        .json({ status: false, message: "Song does not Exist!" });

    song.isDelete = true;

    await song.save();

    return res.status(200).json({ status: true, message: "Success!!" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};
