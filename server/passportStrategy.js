const LocalStrategy = require('passport-local').Strategy
const UserModel    = require('./mongo/models/User')

module.exports = passport => {
    passport.use(
        new LocalStrategy((username, password, done) => {
            UserModel.findOne({ username }, async (err, user) => {
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
                return done(null, user)
            })
        })
    )

    //serialize returns the _id property from LoginsModel record
    passport.serializeUser((user, done) => done(null, user.id))

    //deserialize finds the UsersModel record which matches _id
    //from above
    passport.deserializeUser((id, done) => {
        //This data will be attached to all requests at
        //req.session.passport.user
        UserModel.findById(id, (err, user) => {
            console.log('user = ', user)
            if(err) done(err)
            done(null, user)
        })
    })

    return passport
}
