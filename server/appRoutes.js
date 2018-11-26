const wkdir              = process.cwd()
const env                = process.env.PRODUCTION ? 'dist' : 'dev'
const path               = require('path')
const { ensureLoggedIn } = require('connect-ensure-login')

console.info('Env is set as', env)

module.exports = (express, app, passport, mongo) => {

    app.get('/', ensureLoggedIn('/login'), (req, res) => {
        //check whether user is new and redirect to
        //new user setup page
        if (req.session.passport.user.newUser) {
            console.log('new user')
            return res.render('user-edit')
        } else {
            //render the app
            res.sendFile(path.resolve(wkdir, 'build', env, 'index.html'))
            app.use(express.static(path.resolve(wkdir, 'build', env)))
        }
    })

    app.get('/login', (req, res) => {
        res.render('login')
    })

    app.post('/login', (req, res, next) => {
        console.log('logging')
        passport.authenticate(
            'local',
            { failureRedirect: '/login' },
            (err, user, info) => {
                //user is returned from passport.js
                if (err) return next(err)

                if (!user) {
                    const message = info.error
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
        //user will only contain ID at this point
        console.log(req.body)
        const { password1, password2, displayName } = req.body
        console.log('edit', password1, displayName)
    })

    app.get('/whoami', (req, res) => {
        const { user } = req.session.passport
        //check passwords match
    })
}
