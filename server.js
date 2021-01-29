// import required dependencies
const mustacheExpress = require("mustache-express");
const session = require("express-session");
const bodyParser = require("body-parser");
const express = require("express");
const app = express();

// import auth and database utils
const { newUser, findUserByUsername } = require("./db.js");
const { passport } = require("./passport.js");
const auth_routes = require("./auth.js");
const poll_routes = require("./poll.js");

// application setup
app.use(express.static("public"));

app.engine("html", mustacheExpress());
app.set("view engine", "html");
app.set("views", `${__dirname}/views`);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({
    secret: "wendys-pigtails-secret",
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

// routes
app.get("/", (request, response) => {
    response.render("index");
});

app.use("/auth", auth_routes);
app.use("/poll", poll_routes);

// start server
app.listen(8080);