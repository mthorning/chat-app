const path = require('path')
const express = require('express')
const redis = require('redis')
const session = require('express-session')
const redisStore = require('connect-redis')(session)
const app = express()
const server = app.listen(3000)
const io = require('socket.io').listen(server)
const bodyParser = require('body-parser')
const uuid = require('uuid/v4')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const client = redis.createClient()

client.on('connect', () => {
    console.log('Redis Connected')
    client.set('matt', 'pass')
    client.set('esmae', 'pass')
})

client.on('error', err => console.error('Error connecting to DB', err))

passport.use(
    new LocalStrategy((username, password, done) => {
        const userFound = client.get(username, (err, pass) => {
            if (err) return done(err)

            if (!pass) return done(null, false)

            if (pass !== password) return done(null, false)

            return done(null, username)
        })
        if (userFound === false) return done(null, false)
    })
)

passport.serializeUser((user, done) => done(null, user))

passport.deserializeUser((user, done) => {
    client.get(user, (err, foundUser) => {
        if (err) return done(null, err)
        done(null, foundUser)
    })
})

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(
    session({
        secret: 'esmaesqishpants',
        genid: req => uuid(),
        store: new redisStore({
            host: 'localhost',
            port: 6379,
            client,
            ttl: 260
        }),
        resave: false,
        saveUninitialized: true
    })
)

app.use(passport.initialize())
app.use(passport.session())

app.get('/', require('connect-ensure-login').ensureLoggedIn(), (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'chat.html'))
    app.use(express.static(path.resolve(__dirname, 'dist')))
})

app.get('/login', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'login', 'login.html'))
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
    const user =
        req.session && req.session.passport && req.session.passport.user
    res.status(200).send({ user })
})

io.on('connection', socket => {
    socket.on('chat message', msg => {
        console.log('received ', user)
        io.emit('chat message', { ...msg, user })
    })
    socket.on('disconnect', () => console.log('Socket disconnected'))
})
