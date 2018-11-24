const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const UserModel = require('./mongo/models/User')

module.exports = () => {
    passport.use(
        new LocalStrategy((username, password, done) => {
            UserModel.findOne({ username }, 'password newUser', (err, user) => {
                if (err) {
                    return done(err)
                }
                if (!user) {
                    console.log('No such user')
                    return done(null, false, {
                        error: 'User does not exist'
                    })
                }
                if (user.password !== password) {
                    console.log('Incorrect password')
                    return done(null, false, {
                        error: 'Incorrect username or password'
                    })
                }
                return done(null, user)
            })
        })
    )

    passport.serializeUser((user, done) => done(null, user))

    passport.deserializeUser((username, done) => {
        UserModel.findOne({ username }, function(err, user) {
            if (err) return done(null, err)
            done(null, user)
        })
    })

    return passport
}
