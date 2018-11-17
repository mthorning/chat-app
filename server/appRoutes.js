const path = require('path')
const wkdir = process.cwd()

module.exports = (express, app, passport, client) => {
    app.get(
        '/',
        require('connect-ensure-login').ensureLoggedIn(),
        (req, res) => {
            res.sendFile(path.resolve(wkdir, 'dist', 'chat.html'))
            app.use(express.static(path.resolve(wkdir, 'dist')))
        }
    )

    app.get('/login', (req, res) =>
        res.sendFile(path.resolve(wkdir, 'login', 'login.html'))
    )

    app.post(
        '/login',
        passport.authenticate('local', { failureRedirect: '/login' }),
        (req, res) => res.redirect('/')
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
