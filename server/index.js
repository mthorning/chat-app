const express = require("express");
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

const env = process.env.PRODUCTION ? "dist" : "dev";

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
        secret: "esmaesqishpants",
        genid: (req) => uuid(),
        resave: false,
        store: new mongoStore({ mongooseConnection }),
        cookie: {
          maxAge: 28800000,
        },
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
