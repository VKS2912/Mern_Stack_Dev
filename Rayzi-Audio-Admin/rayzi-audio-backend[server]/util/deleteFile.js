const fs = require("fs");

exports.deleteFile = (file) => {
  if (file && fs.existsSync(file.path)) {
    fs.unlinkSync(file.path);
  }
};

exports.deleteFiles = (files) => {
  files.forEach((file) => this.deleteFile(file));
};
