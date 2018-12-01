const wkdir       = process.cwd()
const env         = process.env.PRODUCTION ? 'dist' : 'dev'
const path        = require('path')
const UserModel   = require('./mongo/models/User')
const password    = require('password-hash-and-salt')

console.info('Env is set as', env)

module.exports = (express, app, passport) => {

    app.get('/', (req, res) => {
        if(req.user && req.user.newUser) {
            return res.render('user-edit')
        } else if(req.user) {
            res.sendFile(path.resolve(wkdir, 'build', env, 'index.html'))
            app.use(express.static(path.resolve(wkdir, 'build', env)))
        } else {
            res.redirect('/login')
        }
    })

    app.get('/login', (req, res) => {
        res.render('login')
    })

    app.get('/logout', (req, res) => {
        req.logout()
        res.redirect('/')
    })

    app.get('/whoami', (req, res) => {
        if(req.user) {
            const { displayName, username } = req.user
            res.status(200).send({ displayName, username })
        } else {
            res.status(404).send({ message: 'User not found' })
        }
    })

    app.post('/login', (req, res, next) => {
        passport.authenticate(
            'local',
            { failureRedirect: '/login' },
            (err, user, info) => {
                //user is returned from passport.js
                if (err) return next(err)

                if (!user) {
                    const message = info && info.error
                    return res.render('login', { message })
                }
                req.logIn(user, function (err) {
                    if (err) return next(err)

                    return res.redirect('/')
                })
            }
        )(req, res, next)
    })

    app.post('/newUserEdit', (req, res) => {
        const { user } = req
        const { password1, password2, displayName } = req.body
        const pwordMatch = password1 === password2
        if(pwordMatch && displayName) {
            UserModel.findById(user.id, (err, userDoc) => {
                if(err) console.error(err)
                if(!userDoc) console.error('No user found', user.id)
                if(userDoc) {
                    password(password1).hash((err, hash) => {
                        if(err) console.error(err)
                        userDoc.newUser = false
                        userDoc.password = hash
                        userDoc.displayName = displayName
                        userDoc.save(err => {
                            if(err) console.error(err)
                            res.redirect('/')
                        })
                    })
                }
            });
        } else {
            const message = {}
            if(!displayName) message['displayName'] = 'Please enter a display name.'
            if(!pwordMatch) message['password'] = 'Passwords don\'t match.'
            res.render('user-edit', { ...message })
        }
    })
}
