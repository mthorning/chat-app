const express = require('express')
const app = express()
const http = require('http').Server(app)
const path = require('path')
const redis = require('redis')
const session = require('express-session')
const redisStore = require('connect-redis')(session)
const io = require('socket.io')(http)
const bodyParser = require('body-parser')
const uuid = require('uuid/v4')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const client = redis.createClient()

const server = http.listen(3000, () => console.log('Listening on P3000'))

client.on('connect', () => {
    const users = require('./user.json')
    console.log('Redis Connected')

    for (let user in users) {
        client.hset('passwords', user, users[user].password, check)

        for (let attr in users[user].data) {
            client.hset(user, attr, users[user].data[attr], check)
        }
    }

    function check(err) {
        if (err) console.error(err)
    }
})

client.on('error', err => console.error('Error connecting to DB', err))

passport.use(
    new LocalStrategy((username, password, done) => {
        const userFound = client.hget('passwords', username, (err, pass) => {
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
    client.hget('passwords', user, (err, foundUser) => {
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
    const username =
        req.session && req.session.passport && req.session.passport.user

    client.hgetall(username, (err, userData) => {
        if (err) res.status(500).send(err)

        if (userData) res.status(200).send(userData)
    })
})

io.on('connection', socket => {
    socket.on('chat message', packet => {
        io.emit('chat message', packet)
        console.log('Sent %o', packet)
    })

    socket.on('disconnect', () => console.log('Socket disconnected'))
})
