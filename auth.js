// import required dependencies
const express = require("express");
const bcrypt = require("bcrypt");

// import auth and database utils
const { saltRounds, newUser } = require("./db.js");
const { passport } = require("./passport.js");

// application setup
const router = express.Router();

// routes
router.get("/", (request, response) => {
    response.redirect("/auth/login");
});

router.get("/login", (request, response) => {
    response.render("login");
});

router.post("/login", passport.authenticate("local", { successRedirect: "/", failureRedirect: "/auth/login", failureFlash: false }));

router.get("/sign-up", (request, response) => {
    response.render("signup");
});

router.post("/sign-up", (request, response) => {
    const { username, password } = request.body;

    bcrypt.hash(password, saltRounds, (err, hash) => {
        newUser(response, username, hash);
    });
});

router.get("/log-out", (request, response) => {
    request.logout();
    response.redirect("/");
});

// export routes
module.exports = router;