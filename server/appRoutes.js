const wkdir              = process.cwd()
const env                = process.env.PRODUCTION ? 'dist' : 'dev'
const path               = require('path')
const UserModel          = require('./mongo/models/User')

console.info('Env is set as', env)

module.exports = (express, app, passport, mongo) => {

    app.get('/', (req, res) => {
        //render the app
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

    app.get('/logout', (req, res) => {
        req.logout()
        res.redirect('/')
    })

    app.post('/newUserEdit', (req, res) => {
        console.log('called nue')
        const { user } = req.session.passport
        const { password1, password2, displayName } = req.body
        if(password1 === password2) {
            const update = {
                password: password1,
                newUser: false,
                displayName
            }
            UserModel.findOneAndUpdate({ id:user.id }, update, err => {
                if(err) console.error(err)
                res.redirect('/')
            });
        } else {
            res.redirect('/')
        }
    })

    app.get('/whoami', (req, res) => {
        const { user } = req.session.passport
    })
}
