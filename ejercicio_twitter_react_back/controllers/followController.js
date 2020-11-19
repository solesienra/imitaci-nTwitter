const { User, Tweet } = require("../models");

module.exports = {
  showFollowing: async (req, res) => {
    const user = await User.findOne({ userName: req.params.username }).populate(
      "following"
    );

    return res.json(user);
  },

  showFollowers: async (req, res) => {
    const user = await User.findOne({ userName: req.params.username }).populate(
      "followers"
    );

    return res.json(user);
  },

  follow: async (req, res) => {
    User.findOne({ userName: req.params.username }, function (err, user) {
      if (user.id !== req.user.id) {
        if (!user.followers.includes(req.user.id)) {
          user.followers.push(req.user.id);
          var followedUser = user.id;
          user.save(function (err) {
            User.findById(req.user.id, function (err, user) {
              user.following.push(followedUser);
              user.save(function (err) {
                res.status(200).json(user);
              });
            });
          });
        } else {
          const index = user.followers.indexOf(req.user.id);
          user.followers.splice(index, 1);
          var followedUser = user.id;
          user.save().then(() => {
            User.findById(req.user.id, function (err, user) {
              const index = user.following.indexOf(followedUser);
              user.following.splice(index, 1);
              user.save(function (err) {
                res.status(200).json(user);
              });
            });
          });
        }
      } else {
        res.status(400).json({ error: "Hubo un error" });
      }
    });
  },
};
