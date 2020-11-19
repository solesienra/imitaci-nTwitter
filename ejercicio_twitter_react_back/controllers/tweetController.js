const moment = require("moment");
const { User, Tweet } = require("../models");
const { findOne } = require("../models/User");
const userController = require("./userController");

module.exports = {
  createTweet: async (req, res) => {
    const user = await User.findById(req.user.id);
    const tweet = await new Tweet({
      author: user,
      content: req.body.content,
      date: moment().format(),
    });

    tweet
      .save()
      .then(async (tweet) => {
        console.log("LLEGO EL TWEET");
        user.tweets.push(tweet);
        await user.save();
        res.status(200).json(tweet);
      })
      .catch((error) => {
        res.status(400).json({ error: "Algo fallo" });
      });
  },

  userTweets: async (req, res) => {
    console.log("req.user es: ", req.user);
    const user = await User.findById(req.user.id);

    let tweets = [];

    tweets.push(
      ...(await Tweet.find({
        $or: [{ author: user.following }, { author: req.user.id }],
      })
        .sort("-date")
        .limit(20)
        .populate("author"))
    );

    tweets.forEach((tweet) => {
      tweet.date = moment(new Date(tweet.date)).format("LLL");
    });

    let ownTweet = false;
    if (user.id === req.user.id) {
      ownTweet = true;
    }

    res.json({ tweets: tweets, ownTweet: ownTweet });
  },

  deleteTweet: async (req, res) => {
    const tweet = await Tweet.findById(req.params.id);
    await Tweet.deleteOne({ _id: req.params.id }); //cambiar a deleteById
    const user = await User.findById(tweet.author._id);
    const index = user.tweets.indexOf(req.params.id);
    user.tweets.splice(index, 1);
    user.save();

    res.status(200).json(tweet);
  },
};
