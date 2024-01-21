const sharp = require("sharp");
const fs = require("fs");
const deleteFile = require("./deleteFile");

exports.compressImage = (file) => {
  if (file.mimetype !== "image/webp") {
    const tempFilename = Date.now() + "_c_" + `${file.originalname}`;
    sharp(file.path)
      .jpeg({
        quality: 50
      })
      .toFile("storage\\" + tempFilename, (err, info) => {
        if (err) {
          console.log(err)
          deleteFile(file);
          return res.status(200).json({
            status: false,
            message: "Compress error",
          });
        }

        fs.renameSync("storage\\" + tempFilename, file.path, (err) => {
          if (err) {
            deleteFile(file);
            return res.status(200).json({
              status: false,
              message: "Renaming file error",
            });
          }
        });
      });
  }
}