const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tweetSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: "User" },
  content: {
    type: String,
    // minlength: [1, "too short"],
    // maxlength: [140, "too long"],
  },
  date: { type: Date, default: Date.now },
  likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

module.exports = tweetSchema;
