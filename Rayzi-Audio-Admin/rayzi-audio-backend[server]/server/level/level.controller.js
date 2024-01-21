const Level = require("./level.model");
const fs = require("fs");
const { deleteFile } = require("../../util/deleteFile")
const { compressImage } = require("../../util/compressImage");

exports.index = async (req, res) => {
  try {
    const level = await Level.find().sort({
      coin: -1,
    });

    if (!level) return res.status(200).json({ status: false, message: "Level data not found!" });

    return res
      .status(200)
      .json({ status: true, message: "Success!!", level });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

exports.store = async (req, res) => {
  try {
    if (!req.body.name || !req.body.coin || !req.file) {
      deleteFile(req.file)
      return res
        .status(200)
        .json({ status: false, message: "Invalid Details!" });
    }

    // compress image
    compressImage(req.file);

    const level = new Level();

    level.name = req.body.name;
    level.image = req.file.path;
    level.coin = parseInt(req.body.coin);

    await level.save();

    return res
      .status(200)
      .json({ status: true, message: "Success!!", level });
  } catch (error) {
    console.log(error);
    deleteFile(req.file);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

exports.update = async (req, res) => {
  try {
    const level = await Level.findById(req.params.levelId);

    if (!level) {
      return res
        .status(200)
        .json({ status: false, message: "Level does not Exist!!" });
    }

    if (req.file) {
      if (fs.existsSync(level.image)) {
        fs.unlinkSync(level.image);
      }
      // compress image
      compressImage(req.file);

      level.image = req.file.path;
    }

    level.name = req.body.name;
    level.coin = parseInt(req.body.coin);

    await level.save();

    return res
      .status(200)
      .json({ status: true, message: "Success!!", level });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

exports.destroy = async (req, res) => {
  try {
    const level = await Level.findById(req.params.levelId);

    if (!level) {
      return res
        .status(200)
        .json({ status: false, message: "Level does not Exist!!" });
    }

    if (fs.existsSync(level.image)) {
      fs.unlinkSync(level.image);
    }

    await level.deleteOne();

    return res.status(200).json({ status: true, message: "Success!!" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

exports.updateAccessibleFunction = async (req, res) => {
  try {
    if (!req.body.levelId || !req.body.fieldName) return res.status(200).json({ status: false, message: "Invalid Details!" });

    const fieldName = req.body.fieldName;

    const level = await Level.findById(req.body.levelId);

    if (!level) return res.status(200).json({ status: false, message: "Level does not Exist!" });

    if (fieldName === "liveStreaming") {
      level.accessibleFunction.liveStreaming = !level.accessibleFunction.liveStreaming;
    }
    else if (fieldName === "freeCall") {
      level.accessibleFunction.freeCall = !level.accessibleFunction.freeCall;
    }
    else if (fieldName === "cashOut") {
      level.accessibleFunction.cashOut = !level.accessibleFunction.cashOut;
    }
    else if (fieldName === "uploadVideo") {
      level.accessibleFunction.uploadVideo = !level.accessibleFunction.uploadVideo;
    }
    else {
      level.accessibleFunction.uploadPost = !level.accessibleFunction.uploadPost;
    }

    await level.save();

    return res.status(200).json({ status: true, message: "Success!!", level })
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, error: error.message || "Server Error" })
  }
}