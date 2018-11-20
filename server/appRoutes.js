const path = require('path')
const wkdir = process.cwd()
const env = process.env.PRODUCTION ? 'dist' : 'dev'

console.log('Env is set as ', env)
console.log('wkdir ', wkdir)

module.exports = (express, app, passport, client) => {
    app.get(
        '/',
        require('connect-ensure-login').ensureLoggedIn('/login'),
        (req, res) => {
            res.sendFile(path.resolve(wkdir, 'build', env, 'index.html'))
            app.use(express.static(path.resolve(wkdir, 'build', env)))
        }
    )

    app.get('/login', (req, res) => {
        res.sendFile(path.resolve(wkdir, 'build', env, 'login.html'))
    })

    app.post('/login', passport.authenticate('local'), (req, res) =>
        res.redirect('/')
    )

    app.get('/logout', (req, res) => {
        req.logout()
        res.redirect('/')
    })

    app.get('/whoami', (req, res) => {
        const username =
            req.session && req.session.passport && req.session.passport.user

        client.hgetall(username, (err, userData) => {
            if (err) res.status(500).send(err)

            if (userData) res.status(200).send(userData)
        })
    })
}
