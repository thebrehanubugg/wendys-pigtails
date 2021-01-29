// import required dependencies
const dotenv = require("dotenv").config();
const { Deta } = require("deta");
const bcrypt = require("bcrypt");
const { response } = require("express");

// application setup
const deta = Deta(process.env.PROJECT_KEY);
const saltRounds = 12;

// table references
const users = deta.Base("users");
const polls = deta.Base("polls");

// functions
const findUserByUsername = async (username, callback) => {
    users.get(username)
        .then(user => callback(user))
        .catch(err => callback(null));
}

const newUser = async (response, username, password) => {
    users.insert({
        username,
        password,
        "created_polls": [],
        "polls_voted": [],
        "flags": 0
    }, username)
        .then(() => response.redirect("/auth/login"))
        .catch(err => console.error(err));
}

const newPoll = async (response, username, question, choice_one, choice_two) => {
    polls.insert({
        username,
        question,
        choice_one,
        choice_two,
        "n_choice_one": 0,
        "n_choice_two": 0,
        "flags": 0
    }, question)
        .then(async () => {
            let user = await users.get(username);
            user["created_polls"].push(question);

            users.update({
                "created_polls": user["created_polls"]
            }, username)
                .then(() => response.redirect("/"))
                .catch(err => console.error(err));
        })
        .catch(err => console.error(err));
}

const updatePollVote = async (question, option) => {
    const poll = await polls.get(question);
    
    if(option == 1) {
        polls.update({
            "n_choice_one": poll["n_choice_one"] + 1
        }, question)
            .then(() => response.redirect("/"))
            .catch(err => console.error(err));
    } else {
        polls.update({
            "n_choice_two": poll["n_choice_two"] + 1
        }, question)
            .then(() => response.redirect("/"))
            .catch(err => console.error(err));
    }
}

const updateUserPassword = async (response, username, new_password) => {
    bcrypt.hash(new_password, saltRounds, (err, hash) => {
        users.update({
            "password": hash
        }, username)
            .then(() => response.redirect("/"))
            .catch(err => console.error(err));
    });
}

// export
module.exports = {
    saltRounds,
    users,
    polls,
    findUserByUsername,
    newUser,
    newPoll,
    updatePollVote,
    updateUserPassword,
}