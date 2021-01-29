// import required dependencies
const LocalStrategy = require("passport-local").Strategy;
const passport = require("passport");
const bcrypt = require("bcrypt");

// import database utils
const { findUserByUsername } = require("./db.js");

// passport.js logic
passport.use(new LocalStrategy( 
    async (username, password, done) => {
        findUserByUsername(username, async (user) => {
            if(!user)
                return done(null, false, { message: "Incorrect username." });
            
            const match = await bcrypt.compare(password, user["password"]);
            if(!match)
                return done(null, false, { message: "Incorrect password." });
            
            return done(null, user);
        });
    }
));

passport.serializeUser((user, done) => {
    done(null, user.username);
});

passport.deserializeUser((username, done) => {
    findUserByUsername(username, (user) => {
        done(null, user);
    });
});

const isLoggedIn = (request, response, next) => {
    if(request.user)
        next();
    else
        response.redirect("/auth/login");
}

// export functions
module.exports = {
    passport,
    isLoggedIn
}