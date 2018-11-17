const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

module.exports = client => {
    passport.use(
        new LocalStrategy((username, password, done) => {
            const userFound = client.hget(
                'passwords',
                username,
                (err, pass) => {
                    if (err) return done(err)

                    if (!pass) return done(null, false)

                    if (pass !== password) return done(null, false)

                    return done(null, username)
                }
            )
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
