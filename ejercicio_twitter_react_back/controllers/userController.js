const { User } = require("../models");

module.exports = {
  getMe: async (req, res) => {
    const user = await User.findById(req.user.id).populate("tweets");

    user.tweets.reverse();
    res.redirect(`/${user.userName}`);
  },

  getUser: async (req, res) => {
    const user = await User.findOne({ userName: req.params.username }).populate(
      {
        path: "tweets",
        options: {
          limit: 20,
          sort: "-date",
        },
      }
    );

    let alreadyFollowing = false;
    let ownTweet = false;

    if (req.user !== undefined) {
      if (user.id === req.user.id) {
        ownTweet = true;
      }
      alreadyFollowing = user.followers.includes(req.user.id);
    }
    /*  if (user.tweets.length > 1) {
      user.tweets.reverse();
    } */

    res.json(user, ownTweet, alreadyFollowing);
  },
};
