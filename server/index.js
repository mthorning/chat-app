const express = require("express");
require("dotenv").config();
const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session");
const mongoStore = require("connect-mongo")(session);
const uuid = require("uuid/v4");
const flash = require("connect-flash");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const socketFuncs = require("./socket")(io);
var cloudinary = require("cloudinary").v2;

const env = process.env.PRODUCTION ? "dist" : "dev";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(flash());

if (env === "dev") app.cache = {};

const mongo = require("./mongo/connect")
  .then((mongooseConnection) => {
    app.use(
      session({
        saveUninitialized: true,
        secret: process.env.SESSION_SECRET,
        genid: (req) => uuid(),
        resave: false,
        store: new mongoStore({ mongooseConnection }),
      })
    );

    const passport = require("passport");
    app.use(passport.initialize());
    app.use(passport.session());
    require("./passportStrategy")(passport);

    io.on("connection", socketFuncs);

    require("./appRoutes")(express, app, passport, mongo);
    http.listen(9912, () => console.log("Listening on port 9912"));
  })
  .catch((err) => console.error(err));
