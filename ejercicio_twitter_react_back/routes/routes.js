const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const tweetController = require("../controllers/tweetController");
const followController = require("../controllers/followController");
const likeController = require("../controllers/likeController");
const middleware = require("../middlewares/middleware");
const checkJwt = require("express-jwt");

module.exports = function routes(app) {
  //RUTAS PUBLICAS

  app.post("/users", authController.createUser);

  app.get("/users/:username", userController.getUser);

  app.post("/login", authController.login);

  //RUTAS PRIVADAS
  app.use(checkJwt({ secret: process.env.JWT_SECRET, algorithms: ["HS256"] }));

  app.put("/users", authController.userUpdate);

  app.get("/tweets", tweetController.userTweets);

  app.post("/tweets", tweetController.createTweet);

  app.delete(
    "/tweets/:id",
    middleware.tweetAuthor,
    tweetController.deleteTweet
  );

  app.put("/tweets/:id", likeController.likes);

  app.get("/users/:username/following", followController.showFollowing);

  app.get("/users/:username/followers", followController.showFollowers);

  app.post("/users/:username/follow", followController.follow);
};
