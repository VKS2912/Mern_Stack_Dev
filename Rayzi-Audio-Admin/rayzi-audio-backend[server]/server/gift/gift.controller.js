const Gift = require("./gift.model");
const Category = require("../giftCategory/giftCategory.model");
const fs = require("fs");
const { deleteFiles, deleteFile } = require("../../util/deleteFile");

// get all gift
exports.index = async (req, res) => {
  try {
    const gift = await Category.aggregate([
      {
        $lookup: {
          from: "gifts",
          localField: "_id",
          foreignField: "category",
          as: "gift",
        },
      },
    ]);

    return res.status(200).json({ status: true, message: "Success!!", gift });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

// get category wise gifts
exports.categoryWiseGift = async (req, res) => {
  try {
    const category = await Category.findById(req.params.categoryId);
    if (!category)
      return res
        .status(200)
        .json({ status: false, message: "Category does not Exist!" });

    const gift = await Gift.aggregate([
      { $match: { category: { $eq: category._id } } },
      {
        $addFields: { count: 0 }, // patiyu
      },
      { $sort: { createdAt: -1 } },
    ]);
    if (!gift)
      return res.status(200).json({ status: false, message: "No data found!" });

    return res.status(200).json({ status: true, message: "Success!!", gift });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

//store multiple gift
exports.store = async (req, res) => {
  try {
    if (!req.body.coin || !req.files || !req.body.category) {
      if (req.files) {
        deleteFiles(req.files);
      }
      return res
        .status(200)
        .json({ status: false, message: "Invalid Details!" });
    }

    const category = await Category.findById(req.body.category);
    if (!category)
      return res
        .status(200)
        .json({ status: false, message: "Category does not Exist!" });

    const gift = req.files.map((gift) => ({
      image: gift.path,
      coin: req.body.coin,
      category: category._id,
      type: gift.mimetype === "image/gif" ? 1 : 0,
    }));

    const gifts = await Gift.insertMany(gift);

    let data = [];

    for (let i = 0; i < gifts.length; i++) {
      data.push(await Gift.findById(gifts[i]._id).populate("category", "name"));
    }

    return res
      .status(200)
      .json({ status: true, message: "Success!", gift: data });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

// update gift
exports.update = async (req, res) => {
  try {
    const gift = await Gift.findById(req.params.giftId);

    if (!gift) {
      deleteFile(req.file);
      return res
        .status(200)
        .json({ status: false, message: "Gift does not Exist!" });
    }
    if (req.file) {
      if (fs.existsSync(gift.image)) {
        fs.unlinkSync(gift.image);
      }
      gift.type = req.file.mimetype === "image/gif" ? 1 : 0;
      gift.image = req.file.path;
    }
    gift.coin = req.body.coin;
    gift.category = req.body.category && req.body.category;

    await gift.save();

    const data = await Gift.findById(gift._id).populate("category", "name");

    return res
      .status(200)
      .json({ status: true, message: "Success!", gift: data });
  } catch (error) {
    console.log(error);
    deleteFile(req.file);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

// delete gift
exports.destroy = async (req, res) => {
  try {
    const gift = await Gift.findById(req.params.giftId);

    if (!gift)
      return res
        .status(200)
        .json({ status: false, message: "Gift does not Exist!" });

    if (fs.existsSync(gift.image)) {
      fs.unlinkSync(gift.image);
    }
    await gift.deleteOne();

    return res.status(200).json({ status: true, message: "Success!" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};
