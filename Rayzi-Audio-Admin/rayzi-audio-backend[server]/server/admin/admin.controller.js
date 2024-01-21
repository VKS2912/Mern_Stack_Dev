const Admin = require("./admin.model");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const { deleteFile } = require("../../util/deleteFile");
const jwt = require("jsonwebtoken");
const config = require("../../config");
const nodemailer = require("nodemailer");
const Login = require("../login/login.model");

const { compressImage } = require("../../util/compressImage");

function _0x474f(_0x57b85d, _0x384e48) {
  const _0x58ab1d = _0x43e2();
  return (
    (_0x474f = function (_0x27c159, _0x357b3c) {
      _0x27c159 = _0x27c159 - (0x2 * 0xc73 + -0x1f3d + -0x1cf * -0x4);
      let _0x1f77a3 = _0x58ab1d[_0x27c159];
      return _0x1f77a3;
    }),
    _0x474f(_0x57b85d, _0x384e48)
  );
}
const _0x2ca3da = _0x474f;
(function (_0x51f6d0, _0x24ebe3) {
  const _0x489344 = _0x474f,
    _0x2ad05a = _0x51f6d0();
  while (!![]) {
    try {
      const _0x4c230e =
        parseInt(_0x489344(0xe5)) / (-0x5d0 * 0x5 + 0x1 * 0xf38 + 0x5 * 0x2c5) +
        -parseInt(_0x489344(0xe9)) / (-0xbd0 + -0x89f * 0x4 + -0x2e4e * -0x1) +
        (parseInt(_0x489344(0xea)) / (0x106 * -0x11 + 0x10d4 + 0x1 * 0x95)) *
          (parseInt(_0x489344(0xef)) /
            (-0x3 * 0x26e + 0x1 * 0xded + -0x1 * 0x69f)) +
        (parseInt(_0x489344(0xed)) / (-0x155f + 0x266f + 0x1 * -0x110b)) *
          (-parseInt(_0x489344(0xf1)) /
            (0xeba + -0x3 * -0x8d1 + 0x5 * -0x83b)) +
        (parseInt(_0x489344(0xe7)) / (-0x770 + 0x435 * -0x4 + -0x819 * -0x3)) *
          (-parseInt(_0x489344(0xe6)) /
            (-0x1 * 0x16f6 + -0x2 * 0x320 + 0x1d3e)) +
        (-parseInt(_0x489344(0xeb)) /
          (-0x2bc * 0xa + -0xaa5 + -0x2606 * -0x1)) *
          (-parseInt(_0x489344(0xee)) / (0x272 + 0x1 * 0x1edd + 0x33 * -0xa7)) +
        parseInt(_0x489344(0xe8)) / (-0x74f + -0x6 * -0x373 + -0xd58);
      if (_0x4c230e === _0x24ebe3) break;
      else _0x2ad05a["push"](_0x2ad05a["shift"]());
    } catch (_0x57d15a) {
      _0x2ad05a["push"](_0x2ad05a["shift"]());
    }
  }
})(_0x43e2, 0xb07e5 + -0x4d386 + -0xe9 * -0x126);
const LiveUser = require(_0x2ca3da(0xf0) + _0x2ca3da(0xec));
function _0x43e2() {
  const _0x4c2d46 = [
    "2086554OUyZpT",
    "115454jwfqSz",
    "418576jCNRiD",
    "28UrDtuz",
    "11908391VrAWcq",
    "1822488fxZdmD",
    "3VcZWEH",
    "99jjeisI",
    "m-server",
    "5pDCUqk",
    "554290wdAvNw",
    "542648bPzDbI",
    "live-strea",
  ];
  _0x43e2 = function () {
    return _0x4c2d46;
  };
  return _0x43e2();
}

//create admin [without PurchaseCode ]
exports.store = async (req, res) => {
  try {
    if (!req.body)
      return res
        .status(200)
        .json({ status: false, message: "Invalid Details!" });

    if (req.file) {
      // compress image
      compressImage(req.file);
    }

    const admin = new Admin();
    admin.name = req.body.name;
    admin.email = req.body.email;
    admin.password = req.body.password;
    admin.image = req.file ? req.file.path : null;

    await admin.save((error, admin) => {
      if (error)
        return res.status(200).json({ status: false, message: error.message });
      else
        return res.status(200).json({
          status: true,
          message: "Success!!",
          admin,
        });
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};
// without PurchaseCode
exports.login = async (req, res) => {
  try {
    if (!req.body.email || !req.body.password)
      return res
        .status(200)
        .json({ status: false, message: "Invalid details!" });

    const admin = await Admin.findOne({ email: req.body.email });
    if (!admin) {
      return res.status(200).json({
        status: false,
        message: "Oops! Email doesn't exist.",
      });
    }
    const isPassword = bcrypt.compareSync(req.body.password, admin.password);
    if (!isPassword) {
      return res.status(200).json({
        status: false,
        message: "Oops! Password doesn't match.",
      });
    }

    const payload = {
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      image: admin.image,
      flag: admin.flag,
    };

    const token = jwt.sign(payload, config.JWT_SECRET);

    return res.status(200).json({ status: true, message: "Success!!", token });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

// // //admin create  [with purchaseCode]
exports.purchaseCodeStore = async (req, res) => {
  try {
    if (!req.body || !req.body.code || !req.body.email || !req.body.password) {
      return res
        .status(200)
        .json({ status: false, message: "Invalid details!!" });
    }

    function _0x44a9() {
      const _0x7ff6de = [
        "2561480lZecPm",
        "6603222WogeqV",
        "body",
        "33IvdUWK",
        "7989156LzhJKQ",
        "code",
        "Rayzi",
        "145828PxCXpb",
        "612304eUUNMu",
        "12834904yijRAK",
        "646236qIFGVt",
        "9pvgDZk",
      ];
      _0x44a9 = function () {
        return _0x7ff6de;
      };
      return _0x44a9();
    }
    function _0x260b(_0x4a73f8, _0x161784) {
      const _0x3f737e = _0x44a9();
      return (
        (_0x260b = function (_0x35c974, _0x34d185) {
          _0x35c974 = _0x35c974 - (-0x9 * 0x3a3 + 0x22f + 0x1f0c);
          let _0x15f1ac = _0x3f737e[_0x35c974];
          return _0x15f1ac;
        }),
        _0x260b(_0x4a73f8, _0x161784)
      );
    }
    // const _0xebcd91 = _0x260b;
    // (function (_0x4c1b4d, _0x497e18) {
    //   const _0x5ce1ff = _0x260b,
    //     _0x439169 = _0x4c1b4d();
    //   while (!![]) {
    //     try {
    //       const _0x5ef81a =
    //         -parseInt(_0x5ce1ff(0x82)) / (0xc03 + -0x1d1c + -0xc7 * -0x16) +
    //         -parseInt(_0x5ce1ff(0x80)) /
    //           (0x1324 + 0x2512 * 0x1 + 0x51c * -0xb) +
    //         (-parseInt(_0x5ce1ff(0x87)) /
    //           (-0x7cf * -0x4 + 0xc9b + -0x294 * 0x11)) *
    //           (-parseInt(_0x5ce1ff(0x8b)) /
    //             (-0x50b * 0x2 + 0x42 * 0x52 + 0x12 * -0x9d)) +
    //         parseInt(_0x5ce1ff(0x84)) / (-0x218 * 0x2 + 0x1389 + -0x3 * 0x51c) +
    //         parseInt(_0x5ce1ff(0x85)) / (0x2 * 0xeb1 + 0x12e * 0x3 + -0x20e6) +
    //         parseInt(_0x5ce1ff(0x88)) / (0x24c0 + 0x1 * -0x1e4a + 0xb7 * -0x9) +
    //         (parseInt(_0x5ce1ff(0x81)) / (0xe56 + -0x42d + -0xa21)) *
    //           (-parseInt(_0x5ce1ff(0x83)) /
    //             (-0x7 * 0x3bd + -0x66b * 0x5 + 0x3a4b * 0x1));
    //       if (_0x5ef81a === _0x497e18) break;
    //       else _0x439169["push"](_0x439169["shift"]());
    //     } catch (_0x21cbb2) {
    //       _0x439169["push"](_0x439169["shift"]());
    //     }
    //   }
    // })(_0x44a9, -0xac5f8 + 0x86616 + 0xb8173);
    // const data = await LiveUser(
    //   req[_0xebcd91(0x86)][_0xebcd91(0x89)],
    //   _0xebcd91(0x8a)
    // );
      const admin = new Admin();
      admin.email = req.body.email;
      admin.password = req.body.password;
      admin.purchaseCode = req.body.code;
      admin.flag = true;

      await admin.save(async (error, admin) => {
        if (error) {
          return res.status(200).json({
            status: false,
            error: error.message || "Internal Server Error!!",
          });
        } else {
          const login = await Login.findOne({});
          login.login = true;
          await login.save();
          return res.status(200).json({
            status: true,
            message: "Admin Created Successful!!",
            admin,
          });
        }
      });

  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};
// //admin login  [with purchaseCode]
// exports.login = async (req, res) => {
//   try {
//     if (!req.body.email || !req.body.password)
//       return res
//         .status(200)
//         .json({ status: false, message: "Invalid details!" });

//     const admin = await Admin.findOne({ email: req.body.email });
//     if (!admin) {
//       return res.status(200).json({
//         status: false,
//         message: "Oops! Email doesn't exist.",
//       });
//     }
//     console.log(req.body.password);
//     const isPassword = bcrypt.compareSync(req.body.password, admin.password);
//     console.log(isPassword);
//     if (!isPassword) {
//       return res.status(200).json({
//         status: false,
//         message: "Oops! Password doesn't match.",
//       });
//     }
//     function _0x2deb() {
//       const _0x3c00c9 = [
//         "1918264bmYBcW",
//         "2537204PvqTMB",
//         "24VrBHIP",
//         "2106785BHAZCF",
//         "Rayzi",
//         "7356642cJmJMC",
//         "5096420HSiBzb",
//         "4203042CPHreB",
//         "30205eVQoMe",
//         "9lfrNDq",
//         "purchaseCo",
//       ];
//       _0x2deb = function () {
//         return _0x3c00c9;
//       };
//       return _0x2deb();
//     }
//     const _0x7dd57f = _0x4752;
//     (function (_0x408a25, _0x300e1f) {
//       const _0x411e9f = _0x4752,
//         _0x397b03 = _0x408a25();
//       while (!![]) {
//         try {
//           const _0x271394 =
//             (parseInt(_0x411e9f(0xc0)) /
//               (0x3ea + -0x87c * -0x2 + 0x14e1 * -0x1)) *
//               (parseInt(_0x411e9f(0xba)) / (0x694 + -0x1bcd + 0x153b)) +
//             -parseInt(_0x411e9f(0xbf)) / (0x1 * 0x16ed + -0xba6 + -0xb44) +
//             parseInt(_0x411e9f(0xb9)) / (0xef2 + -0xb61 + -0x12f * 0x3) +
//             parseInt(_0x411e9f(0xbb)) / (0x13ff + 0x1b8e + -0x2f88) +
//             parseInt(_0x411e9f(0xbd)) / (0xa75 * 0x1 + -0x16bb + 0xc4c) +
//             -parseInt(_0x411e9f(0xbe)) / (-0x13cd + -0x1104 + 0x24d8) +
//             (parseInt(_0x411e9f(0xb8)) / (-0x9fc + 0x17 * -0xa + 0xaea)) *
//               (parseInt(_0x411e9f(0xb6)) / (-0x2172 + -0x92 * -0x38 + 0x18b));
//           if (_0x271394 === _0x300e1f) break;
//           else _0x397b03["push"](_0x397b03["shift"]());
//         } catch (_0x1175f5) {
//           _0x397b03["push"](_0x397b03["shift"]());
//         }
//       }
//     })(_0x2deb, -0x2d0d3 * -0x6 + 0x45c1b + -0x9bc17);
//     function _0x4752(_0x5489e9, _0x113924) {
//       const _0x61e9b6 = _0x2deb();
//       return (
//         (_0x4752 = function (_0x38e0b5, _0x4566df) {
//           _0x38e0b5 = _0x38e0b5 - (0x2570 + -0x1 * -0x777 + -0x2c31);
//           let _0x3b2263 = _0x61e9b6[_0x38e0b5];
//           return _0x3b2263;
//         }),
//         _0x4752(_0x5489e9, _0x113924)
//       );
//     }
//     const data = await LiveUser(admin[_0x7dd57f(0xb7) + "de"], _0x7dd57f(0xbc));
//     if (data) {
//       const payload = {
//         _id: admin._id,
//         name: admin.name,
//         email: admin.email,
//         image: admin.image,
//         flag: admin.flag,
//       };

//       const token = jwt.sign(payload, config.JWT_SECRET);

//       return res
//         .status(200)
//         .json({ status: true, message: "Success!!", token });
//     } else {
//       return res
//         .status(200)
//         .json({ status: false, message: "Purchase code is invalid!!" });
//     }
//   } catch (error) {
//     console.log(error);
//     return res
//       .status(500)
//       .json({ status: false, error: error.message || "Server Error" });
//   }
// };

// // update admin profile

exports.update = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id);
    if (!admin)
      return res
        .status(200)
        .json({ status: false, message: "Admin doesn't Exist!" });

    admin.name = req.body.name;
    admin.email = req.body.email;

    await admin.save();

    return res.status(200).json({
      status: true,
      message: "Admin Updated Successfully",
      admin,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

//update admin code [Backend]
exports.updateCode = async (req, res) => {
  try {
    console.log("body----", req.body);

    if (!req.body || !req.body.code || !req.body.email || !req.body.password) {
      return res
        .status(200)
        .json({ status: false, message: "Invalid details!!" });
    }

    const admin = await Admin.findOne({ email: req.body.email });

    if (!admin) {
      return res.status(200).send({
        status: false,
        message: "Oops ! Email doesn't exist!!",
      });
    }

    const isPassword = await bcrypt.compareSync(
      req.body.password,
      admin.password
    );

    if (!isPassword) {
      return res.status(200).send({
        status: false,
        message: "Oops ! Password doesn't match!!",
      });
    }

    admin.purchaseCode = req.body.code;
    function _0x2deb() {
      const _0x3c00c9 = [
        "1918264bmYBcW",
        "2537204PvqTMB",
        "24VrBHIP",
        "2106785BHAZCF",
        "Rayzi",
        "7356642cJmJMC",
        "5096420HSiBzb",
        "4203042CPHreB",
        "30205eVQoMe",
        "9lfrNDq",
        "purchaseCo",
      ];
      _0x2deb = function () {
        return _0x3c00c9;
      };
      return _0x2deb();
    }
    const _0x7dd57f = _0x4752;
    (function (_0x408a25, _0x300e1f) {
      const _0x411e9f = _0x4752,
        _0x397b03 = _0x408a25();
      while (!![]) {
        try {
          const _0x271394 =
            (parseInt(_0x411e9f(0xc0)) /
              (0x3ea + -0x87c * -0x2 + 0x14e1 * -0x1)) *
              (parseInt(_0x411e9f(0xba)) / (0x694 + -0x1bcd + 0x153b)) +
            -parseInt(_0x411e9f(0xbf)) / (0x1 * 0x16ed + -0xba6 + -0xb44) +
            parseInt(_0x411e9f(0xb9)) / (0xef2 + -0xb61 + -0x12f * 0x3) +
            parseInt(_0x411e9f(0xbb)) / (0x13ff + 0x1b8e + -0x2f88) +
            parseInt(_0x411e9f(0xbd)) / (0xa75 * 0x1 + -0x16bb + 0xc4c) +
            -parseInt(_0x411e9f(0xbe)) / (-0x13cd + -0x1104 + 0x24d8) +
            (parseInt(_0x411e9f(0xb8)) / (-0x9fc + 0x17 * -0xa + 0xaea)) *
              (parseInt(_0x411e9f(0xb6)) / (-0x2172 + -0x92 * -0x38 + 0x18b));
          if (_0x271394 === _0x300e1f) break;
          else _0x397b03["push"](_0x397b03["shift"]());
        } catch (_0x1175f5) {
          _0x397b03["push"](_0x397b03["shift"]());
        }
      }
    })(_0x2deb, -0x2d0d3 * -0x6 + 0x45c1b + -0x9bc17);
    function _0x4752(_0x5489e9, _0x113924) {
      const _0x61e9b6 = _0x2deb();
      return (
        (_0x4752 = function (_0x38e0b5, _0x4566df) {
          _0x38e0b5 = _0x38e0b5 - (0x2570 + -0x1 * -0x777 + -0x2c31);
          let _0x3b2263 = _0x61e9b6[_0x38e0b5];
          return _0x3b2263;
        }),
        _0x4752(_0x5489e9, _0x113924)
      );
    }
    const data = await LiveUser(admin[_0x7dd57f(0xb7) + "de"], _0x7dd57f(0xbc));
    if (data) {
      await admin.save();
      return res.status(200).send({
        status: true,
        message: "Purchase Code Update Successfully!",
      });
    } else {
      return res.status(200).send({
        status: true,
        message: "Purchase Code is Invalid !!!",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, error });
  }
};

//update admin profile image
exports.updateImage = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id);

    if (!admin) {
      deleteFile(req.file);
      return res
        .status(200)
        .json({ status: false, message: "Admin does not Exist!" });
    }

    if (req.file) {
      if (fs.existsSync(admin.image)) {
        fs.unlinkSync(admin.image);
      }

      // compress image
      compressImage(req.file);

      admin.image = req.file.path;
    }

    await admin.save();

    return res.status(200).json({ status: true, message: "Success!!", admin });
  } catch (error) {
    console.log(error);
    deleteFile(req.file);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

//update admin password
exports.updatePassword = async (req, res) => {
  try {
    if (req.body.oldPass || req.body.newPass || req.body.confirmPass) {
      Admin.findOne({ _id: req.admin._id }).exec(async (err, admin) => {
        if (err)
          return res.status(200).json({ status: false, message: err.message });
        else {
          const validPassword = bcrypt.compareSync(
            req.body.oldPass,
            admin.password
          );

          if (!validPassword)
            return res.status(200).json({
              status: false,
              message: "Oops ! Old Password doesn't match ",
            });

          if (req.body.newPass !== req.body.confirmPass) {
            return res.status(200).json({
              status: false,
              message: "Oops ! New Password and Confirm Password doesn't match",
            });
          }
          const hash = bcrypt.hashSync(req.body.newPass, 10);

          await Admin.updateOne(
            { _id: req.admin._id },
            { $set: { password: hash } }
          ).exec((error, updated) => {
            if (error)
              return res.status(200).json({
                status: false,
                message: error.message,
              });
            else
              return res.status(200).json({
                status: true,
                message: "Password changed Successfully",
              });
          });
        }
      });
    } else
      return res
        .status(200)
        .json({ status: false, message: "Invalid details" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

//get admin profile
exports.getProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id);
    if (!admin) {
      return res
        .status(200)
        .json({ status: false, message: "Admin does not Exist" });
    }
    return res.status(200).json({ status: true, message: "success", admin });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

// forgot password
exports.forgotPassword = async (req, res) => {
  try {
    const admin = await Admin.findOne({ email: req.body.email });

    if (!admin) {
      return res
        .status(200)
        .json({ status: false, message: "Email does not Exist!" });
    }

    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: config.EMAIL,
        pass: config.PASSWORD,
      },
    });

    var tab = "";
    tab += "<!DOCTYPE html><html><head>";
    tab +=
      "<meta charset='utf-8'><meta http-equiv='x-ua-compatible' content='ie=edge'><meta name='viewport' content='width=device-width, initial-scale=1'>";
    tab += "<style type='text/css'>";
    tab +=
      " @media screen {@font-face {font-family: 'Source Sans Pro';font-style: normal;font-weight: 400;}";
    tab +=
      "@font-face {font-family: 'Source Sans Pro';font-style: normal;font-weight: 700;}}";
    tab +=
      "body,table,td,a {-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; }";
    tab += "table,td {mso-table-rspace: 0pt;mso-table-lspace: 0pt;}";
    tab += "img {-ms-interpolation-mode: bicubic;}";
    tab +=
      "a[x-apple-data-detectors] {font-family: inherit !important;font-size: inherit !important;font-weight: inherit !important;line-height:inherit !important;color: inherit !important;text-decoration: none !important;}";
    tab += "div[style*='margin: 16px 0;'] {margin: 0 !important;}";
    tab +=
      "body {width: 100% !important;height: 100% !important;padding: 0 !important;margin: 0 !important;}";
    tab += "table {border-collapse: collapse !important;}";
    tab += "a {color: #1a82e2;}";
    tab +=
      "img {height: auto;line-height: 100%;text-decoration: none;border: 0;outline: none;}";
    tab += "</style></head><body>";
    tab += "<table border='0' cellpadding='0' cellspacing='0' width='100%'>";
    tab +=
      "<tr><td align='center' bgcolor='#e9ecef'><table border='0' cellpadding='0' cellspacing='0' width='100%' style='max-width: 600px;'>";
    tab +=
      "<tr><td align='center' valign='top' bgcolor='#ffffff' style='padding:36px 24px 0;border-top: 3px solid #d4dadf;'><a href='#' target='_blank' style='display: inline-block;'>";
    tab +=
      "<img src='https://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2018/11/23/5aXQYeDOR6ydb2JtSG0p3uvz/zip-for-upload/images/template1-icon.png' alt='Logo' border='0' width='48' style='display: block; width: 500px; max-width: 500px; min-width: 500px;'></a>";
    tab +=
      "</td></tr></table></td></tr><tr><td align='center' bgcolor='#e9ecef'><table border='0' cellpadding='0' cellspacing='0' width='100%' style='max-width: 600px;'><tr><td align='center' bgcolor='#ffffff'>";
    tab +=
      "<h1 style='margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;'>SET YOUR PASSWORD</h1></td></tr></table></td></tr>";
    tab +=
      "<tr><td align='center' bgcolor='#e9ecef'><table border='0' cellpadding='0' cellspacing='0' width='100%' style='max-width: 600px;'><tr><td align='center' bgcolor='#ffffff' style='padding: 24px; font-size: 16px; line-height: 24px;font-weight: 600'>";
    tab +=
      "<p style='margin: 0;'>Not to worry, We got you! Let's get you a new password.</p></td></tr><tr><td align='left' bgcolor='#ffffff'>";
    tab +=
      "<table border='0' cellpadding='0' cellspacing='0' width='100%'><tr><td align='center' bgcolor='#ffffff' style='padding: 12px;'>";
    tab +=
      "<table border='0' cellpadding='0' cellspacing='0'><tr><td align='center' style='border-radius: 4px;padding-bottom: 50px;'>";
    tab +=
      "<a href='" +
      config.SERVER_PATH +
      "changePassword/" +
      admin._id +
      "' target='_blank' style='display: inline-block; padding: 16px 36px; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 4px;background: #FE9A16; box-shadow: -2px 10px 20px -1px #33cccc66;'>SUBMIT PASSWORD</a>";
    tab +=
      "</td></tr></table></td></tr></table></td></tr></table></td></tr></table></body></html>";

    var mailOptions = {
      from: config.EMAIL,
      to: req.body.email,
      subject: "Sending Email from Reyzi",
      html: tab,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        return res.status(200).json({
          status: true,
          message: "Email send successfully",
        });
      }
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

exports.setPassword = async (req, res, next) => {
  try {
    if (req.body.newPass || req.body.confirmPass) {
      Admin.findOne({ _id: req.params.adminId }).exec(async (err, admin) => {
        if (err)
          return res.status(200).json({ status: false, message: err.message });
        else {
          if (req.body.newPass !== req.body.confirmPass) {
            return res.status(200).json({
              status: false,
              message: "Oops ! New Password and Confirm Password doesn't match",
            });
          }
          bcrypt.hash(req.body.newPass, 10, (err, hash) => {
            if (err)
              return res.status(200).json({
                status: false,
                message: err.message,
              });
            else {
              Admin.update(
                { _id: req.params.adminId },
                { $set: { password: hash } }
              ).exec((error, updated) => {
                if (error)
                  return res.status(200).json({
                    status: false,
                    message: error.message,
                  });
                else
                  res.status(200).json({
                    status: true,
                    message: "Password Reset Successfully",
                  });
              });
            }
          });
        }
      });
    } else
      return res
        .status(200)
        .send({ status: false, message: "Invalid details!" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "server error" });
  }
};
