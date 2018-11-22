const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const sanitize = require('./sanitizeString')

module.exports = client => {
    passport.use(
        new LocalStrategy((username, password, done) => {
            const uname = sanitize(username)
            const pword = sanitize(password)
            const userFound = client.hget('passwords', uname, (err, pass) => {
                if (err) return done(err)

                if (!pass) return done(null, false)

                if (pass !== pword) return done(null, false)

                return done(null, uname)
            })
            if (userFound === false) return done(null, false)
        })
    )

    passport.serializeUser((user, done) => done(null, user))

    passport.deserializeUser((user, done) => {
        client.hget('passwords', user, (err, foundUser) => {
            if (err) return done(null, err)
            done(null, foundUser)
        })
    })

    return passport
}
