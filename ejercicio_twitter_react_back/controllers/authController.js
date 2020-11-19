const passport = require("passport");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const formidable = require("formidable");
const path = require("path");
const bcrypt = require("bcryptjs");

function reqToken(user) {
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
  return {
    token: token,
    userId: user.id,
    userName: user.userName,
    userEmail: user.email,
  };
}
module.exports = {
  login: (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({
      $or: [{ email: email }, { userName: email }],
    }).then((user) => {
      if (user) {
        if (bcrypt.compareSync(password, user.password)) {
          res.json(reqToken(user));
        } else {
          res.json("Contraseña incorrecta");
        }
      } else {
        res.json("Datos incorrectos");
      }
    });
  },

  createUser: async (req, res) => {
    const user = await new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      userName: req.body.userName,
      email: req.body.email,
      password: req.body.password,
    });
    user
      .save()
      .then((user) => {
        res.json(reqToken(user));
      })
      .catch((error) => {
        console.log(error);
        res.status(400);
      });
  },

  userUpdate: async (req, res) => {
    const form = formidable({
      multiples: true,
      uploadDir: path.dirname(__dirname) + "/public/img", //comentar para poder entrar sin as3
      keepExtensions: true,
    });

    form.parse(req, async (err, fields, files) => {
      const { firstName, lastName, userName, description } = fields; //req.body;
      console.log(firstName, lastName, userName, description);
      const image = "/img/" + path.basename(files.image.path); //comentar para poder entrar sin as3
      const user = await User.findByIdAndUpdate(req.user.id, {
        firstName,
        lastName,
        userName,
        description,
        image, //comentar para poder entrar sin as3
      });
      res.status(200).json(user);
    });
  },
};
