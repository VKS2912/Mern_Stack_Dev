const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const adminSchema = new Schema(
  {
    name: { type: String, default: "Admin" },
    email: String,
    password: String,
    image: { type: String, default: null },
    purchaseCode: { type: String, default: null },
    flag: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

//hash password before the admin is saved
adminSchema.pre("save", function (next) {
  const admin = this;
  //hash password only if the password has been

  if (!admin.isModified("password")) return next();

  bcrypt.hash(admin.password, 10, (err, hash) => {
    if (err) return next(err);

    //changed the password to hashed version
    admin.password = hash;
    next();
  });
});

module.exports = mongoose.model("Admin", adminSchema);
