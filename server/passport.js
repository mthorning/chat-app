const passport      = require('passport')
const LocalStrategy = require('passport-local').Strategy
const LoginsModel   = require('./mongo/models/Logins')
const UsersModel    = require('./mongo/models/Users')

module.exports = () => {
    passport.use(
        new LocalStrategy((username, password, done) => {
            LoginsModel.findOne({ username }, (err, user) => {
                if (err) {
                    return done(err)
                }
                if (!user) {
                    console.info('User does not exist')
                    return done(null, false, {
                        error: 'Incorrect username or password'
                    })
                }
                if (user.password !== password) {
                    console.info('Incorrect password')
                    return done(null, false, {
                        error: 'Incorrect username or password'
                    })
                }
                //returns user from LoginModel to '/' route
                return done(null, user)
            })
        })
    )

    //serialize returns the _id property from LoginsModel record
    passport.serializeUser((user, done) => done(null, user._id))

    //deserialize finds the UsersModel record which matches _id
    //from above
    passport.deserializeUser((id, done) => {
        //This data will be attached to all requests at
        //req.session.passport.user
        UsersModel.findOne({ id }, function deserialize(err, user) {
            if (err) return done(null, err)

            return done(null, user)
        })
    })

    return passport
}
