const mongoose = require("mongoose");
const tweetSchema = require("./Tweet");
const User = require("./User");

mongoose.connect(process.env.MONGODBCONNECTION);
mongoose.connection
  .once("open", () =>
    console.log("¡Conexión con la base de datos establecida!")
  )
  .on("error", (error) => console.log(error));

const Tweet = mongoose.model("Tweet", tweetSchema);
//
module.exports = {
  Tweet,
  User,
  mongoose,
};
