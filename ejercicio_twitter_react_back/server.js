require("dotenv").config();
const express = require("express");
const app = express();
const routes = require("./routes/routes");
const port = process.env.APP_PORT;
const session = require("express-session");
const seeder = require("./seeder");
const path = require("path");
const MongoStore = require("connect-mongo")(session);
const models = require("./models");
const cors = require("cors");
app.locals.moment = require("moment");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(
  session({
    secret: process.env.SECRET,
    resave: false, // Docs: "The default value is true, but using the default has been deprecated".
    saveUninitialized: false, // Docs: "The default value is true, but using the default has been deprecated".
    store: new MongoStore({ mongooseConnection: models.mongoose.connection }),
  })
);

app.use(cors());

routes(app);
/* seeder(); */

app.listen(port, () => console.log(`Servidor escuchado en puerto: ${port}`));
