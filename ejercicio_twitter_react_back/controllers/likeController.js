const models = require("../models");
const { User, Tweet } = require("../models");

module.exports = {
  likes: async (req, res) => {
    const tweet = await Tweet.findById(req.params.id);
    if (!tweet.likes.includes(req.user.id)) {
      tweet.likes.push(req.user.id);
    } else {
      const index = tweet.likes.indexOf(req.user.id);
      tweet.likes.splice(index, 1);
    }
    const likes = tweet.likes.length;
    tweet.save();
    res.status(200).json({ likes: likes });
  },
};
