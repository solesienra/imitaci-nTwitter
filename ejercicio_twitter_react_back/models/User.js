const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
SALT_WORK_FACTOR = 10;

const userSchema = new Schema({
  firstName: { type: String, minlength: [3, "too short"], maxlength: 15 },
  lastName: { type: String, minlength: 3, maxlength: 15 },
  userName: {
    type: String,
    unique: true,
    //match: ["login", "register", "home"],
  },
  email: { type: String, unique: true },
  description: { type: String, minlength: 4, maxlength: 300 },
  image: String,
  password: { type: String, minlength: 4 },
  tweets: [{ type: Schema.Types.ObjectId, ref: "Tweet" }],
  following: [{ type: Schema.Types.ObjectId, ref: "User" }],
  followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

userSchema.virtual("fullName").get(function () {
  return this.firstName + " " + this.lastName;
});

userSchema.pre("save", function (next) {
  var user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified("password")) return next();

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) return next(err);

    // hash the password using our new salt
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);

      // override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
});

const User = mongoose.model("User", userSchema);

module.exports = User;
