const { SERVER_PATH } = require('../../config');
const { deleteFiles, deleteFile } = require('../../util/deleteFile');
const Theme = require('./theme.model');
const fs = require('fs');

// get theme list
exports.index = async (req, res) => {
  try {
    const theme = await Theme.aggregate([
      { $match: { _id: { $ne: null } } },
      {
        $project: {
          theme: 1,
          createdAt: 1,
          updatedAt: 1,
          type: 1,
        },
      },
    ]).sort({ createdAt: -1 });

    if (!theme)
      return res.status(200).json({ status: false, message: 'No data found!' });

    return res.status(200).json({ status: true, message: 'Success!!', theme });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || 'Server Error' });
  }
};

// store multiple theme
exports.store = async (req, res) => {
  try {
    if (!req.files)
      return res
        .status(200)
        .json({ status: false, message: 'Invalid Details!' });

    const theme = req.files.map((theme) => ({
      theme: theme.path,
    }));

    const themes = await Theme.insertMany(theme);

    return res
      .status(200)
      .json({ status: true, message: 'Success!', theme: themes });
  } catch (error) {
    console.log(error);
    deleteFiles(req.files);
    return res
      .status(500)
      .json({ status: false, error: error.message || 'Server Error' });
  }
};

// update theme
exports.update = async (req, res) => {
  try {
    const theme = await Theme.findById(req.params.themeId);

    if (!theme) {
      deleteFile(req.file);
      return res
        .status(200)
        .json({ status: false, message: 'theme does not Exist!' });
    }

    if (req.file) {
      if (fs.existsSync(theme.theme)) {
        fs.unlinkSync(theme.theme);
      }
      theme.theme = req.file.path;
    }

    await theme.save();

    // const theme_ = { ...theme, theme: SERVER_PATH + theme };

    return res
      .status(200)
      .json({ status: true, message: 'Success!', theme: theme });
  } catch (error) {
    console.log(error);
    deleteFile(req.file);
    return res
      .status(500)
      .json({ status: false, error: error.message || 'Server Error' });
  }
};

// delete theme
exports.destroy = async (req, res) => {
  try {
    const theme = await Theme.findById(req.params.themeId);

    if (!theme)
      return res
        .status(200)
        .json({ status: false, message: 'theme does not Exist!' });

    if (fs.existsSync(theme.theme)) {
      fs.unlinkSync(theme.theme);
    }

    await theme.deleteOne();

    return res.status(200).json({ status: true, message: 'Success!' });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || 'Server Error' });
  }
};
