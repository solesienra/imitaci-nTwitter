const { Tweet } = require("../models");
const jwt = require("jsonwebtoken");

module.exports = {
  tweetAuthor: function (req, res, next) {
    Tweet.findById(req.params.id).then((tweet) => {
      if (tweet.author._id.toString() !== req.user.id) {
        res.status(401).json({ error: "No es el autor" });
      } else {
        return next();
      }
    });
  },
};
