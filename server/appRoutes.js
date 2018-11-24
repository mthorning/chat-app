const path = require('path')
const UserModel = require('./mongo/models/User')

const wkdir = process.cwd()
const env = process.env.PRODUCTION ? 'dist' : 'dev'

console.log('Env is set as ', env)

module.exports = (express, app, passport, mongo) => {
    app.get(
        '/',
        require('connect-ensure-login').ensureLoggedIn('/login'),
        (req, res) => {
            res.sendFile(path.resolve(wkdir, 'build', env, 'index.html'))
            app.use(express.static(path.resolve(wkdir, 'build', env)))
        }
    )

    app.get('/login', (req, res) => {
        res.render('login')
    })

    app.post(
        '/login',
        // passport.authenticate('local', {
        //     successRedirect: '/',
        //     failureRedirect: '/login',
        //     failureFlash: 'Incorrect username or password'
        // })
        (req, res, next) => {
            passport.authenticate('local', (err, user, info) => {
                if (err) return next(err)
                if (!user) {
                    const message = info.error
                    return res.render('login', { message })
                }

                req.logIn(user, function(err) {
                    if (err) return next(err)
                    console.log(user)
                    if (user.newUser) {
                        return res.render('user-edit')
                    }
                    return res.redirect('/')
                })
            })(req, res, next)
        }
    )

    app.get('/logout', (req, res) => {
        req.logout()
        res.redirect('/')
    })

    app.post(
        '/newUserEdit',
        require('connect-ensure-login').ensureLoggedIn('/login'),
        (req, res) => {
            const username =
                req.session && req.session.passport && req.session.passport.user
            console.log('username = ', username)
        }
    )

    app.get('/whoami', (req, res) => {
        const username =
            req.session && req.session.passport && req.session.passport.user
        console.log('user is %s.', username)
    })
}
