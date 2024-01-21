const Hashtag = require("./hashtag.model");

// get hashtag list + search [for android]
exports.index = async (req, res) => {
  try {

    let query = {};

    if(req.query.value){
      query = { 
        hashtag: { $regex: req.query.value, $options: "i" } 
      }        
    }
    const hashtag = await Hashtag.aggregate([
      {
        $match:query
      },
      {
        $lookup: {
          from: "posts",
          let: { hashtag: "$hashtag" },
          as: "post",
          pipeline: [
            {
              $match: { $expr: { $in: ["$$hashtag", "$hashtag"] } }
            },
          ]
        }
      },
      {
        $lookup: {
          from: "videos",
          let: { hashtag: "$hashtag" },
          as: "video",
          pipeline: [
            {
              $match: { $expr: { $in: ["$$hashtag", "$hashtag"] } }
            },
          ]
        }
      },
      {
        $project: {
          hashtag: 1,
          postCount: { $size: "$post" },
          videoCount: { $size: "$video" },
        }
      }
    ])

    if (!hashtag) return res.status({ status: false, message: "No data found!" });

    return res.status(200).json({ status: true, message: "Success!!", hashtag });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, error: error.message || "Server Error" })
  }
}

// create hashtag
exports.store = async (req, res) => {
  try {
    if (!req.body.hashtag) return res.status(200).json({ status: false, message: "Invalid Details!" });

    var removeComa = req.body.hashtag.replace(/,\s*$/, "");

    var hashtagList = removeComa.split(",");

    const hashtags = hashtagList.map((hashtag) => ({
      hashtag: hashtag.toLowerCase(),
    }));

    const hashtag = await Hashtag.insertMany(hashtags);

    return res.status(200).json({ status: true, message: "Success!!", hashtag });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, error: error.message || "Server Error" })
  }
}

// update hashtag
exports.update = async (req, res) => {
  try {
    const hashtag = await Hashtag.findById(req.params.hashtagId);

    if (!hashtag) return res.status(200).json({ status: false, message: "Hashtag does not Exist!" });

    hashtag.hashtag = req.body.hashtag.toLowerCase();

    await hashtag.save();

    return res.status(200).json({ status: true, message: "Success!!", hashtag });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, error: error.message || "Server Error" })
  }
}

// delete hashtag
exports.destroy = async (req, res) => {
  try {
    const hashtag = await Hashtag.findById(req.params.hashtagId);

    if (!hashtag) return res.status(200).json({ status: false, message: "Hashtag does not Exist!" });

    await hashtag.deleteOne();

    return res.status(200).json({ status: true, message: "Success!!" });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, error: error.message || "Server Error" })
  }
}