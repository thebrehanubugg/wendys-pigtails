// import required dependencies
const { response } = require("express");
const express = require("express");

// import auth and database utils
const { isLoggedIn } = require("./passport.js");
const { newPoll, updatePollVote } = require("./db.js");

// application setup
const router = express.Router();

// routes
router.get("/", isLoggedIn, (request, response) => {
    response.json("POLLS");
});

router.get("/new", isLoggedIn, (request, response) => {
    response.render("new");
});

router.post("/new", isLoggedIn, (request, response) => {
    const { question, choice_one, choice_two } = request.body;
    newPoll(response, request.user.username, question, choice_one, choice_two);
});

router.get("/update/one", (request, response) => {
    // updatePollVote("Hamburgers")
});

// export routes
module.exports = router;