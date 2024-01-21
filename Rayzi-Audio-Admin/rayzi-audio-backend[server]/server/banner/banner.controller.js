const Banner = require("./banner.model");
const { deleteFile } = require("../../util/deleteFile");
const fs = require("fs");
const { compressImage } = require("../../util/compressImage");

// get VIP and normal banner [android]
exports.getBanner = async (req, res) => {
  try {
    if (!req.query.type)
      return res
        .status(200)
        .json({ status: false, message: "Invalid Details!" });
    let banner;
    if (req.query.type === "VIP") {
      banner = await Banner.find({ isVIP: true }).sort({ createdAt: -1 });
    } else {
      banner = await Banner.find({ isVIP: false }).sort({ createdAt: -1 });
    }

    return res.status(200).json({ status: true, message: "Success!!", banner });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

//get all banner for frontend
exports.index = async (req, res) => {
  try {
    const banner = await Banner.find().sort({ createdAt: -1 });

    if (!banner)
      return res.status(200).json({ status: false, message: "No data found!" });

    return res.status(200).json({ status: true, message: "Success!!", banner });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

// create banner
exports.store = async (req, res) => {
  try {
    if (!req.file)
      return res
        .status(200)
        .json({ status: false, message: "Invalid Details!" });

    // compress image
    compressImage(req.file);

    const banner = new Banner();

    banner.image = req.file.path;
    banner.URL = req.body.URL;

    await banner.save();

    return res.status(200).json({ status: true, message: "Success!", banner });
  } catch (error) {
    console.log(error);
    deleteFile(req.file);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

// update banner
exports.update = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.bannerId);

    if (!banner) {
      deleteFile(req.file);
      return res
        .status(200)
        .json({ status: false, message: "Banner does not Exist!" });
    }

    if (req.file) {
      if (fs.existsSync(banner.image)) {
        fs.unlinkSync(banner.image);
      }
      // compress image
      compressImage(req.file);

      banner.image = req.file.path;
    }
    banner.URL = req.body.URL;

    await banner.save();

    return res.status(200).json({ status: true, message: "Success!", banner });
  } catch (error) {
    console.log(error);
    deleteFile(req.file);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

// delete banner
exports.destroy = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.bannerId);

    if (!banner)
      return res
        .status(200)
        .json({ status: false, message: "Banner does not Exist!" });

    if (fs.existsSync(banner.image)) {
      fs.unlinkSync(banner.image);
    }
    await banner.deleteOne();

    return res.status(200).json({ status: true, message: "Success!" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

//set banner to VIP
exports.VIPBannerSwitch = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.bannerId);

    if (!banner)
      return res
        .status(200)
        .json({ status: false, message: "Banner does not Exist!" });

    banner.isVIP = !banner.isVIP;
    await banner.save();

    return res.status(200).json({ status: true, message: "Success!", banner });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};
