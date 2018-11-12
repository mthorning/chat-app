const path = require('path')
const express = require('express')
const redis = require('redis')
const session = require('express-session')
const redisStore = require('connect-redis')(session)
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const bodyParser = require('body-parser')
const uuid = require('uuid/v4')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const client = redis.createClient()

client.on('connect', () => {
    console.log('Redis Connected')
    client.set('matt', 'password')
    client.set('esmaesquish', 'coco&bonobo')
})

client.on('error', err => console.error('Error connecting to DB', err))

passport.use(
    new LocalStrategy(function(username, password, done) {
        console.log('Authenticating ', username, password, client.get(username))
        const userFound = client.get(username, function(err, pass) {
            console.log('Got ', err, pass)
            if (err) {
                return done(err)
            }
            if (!pass) {
                return done(null, false)
            }
            if (!verifyPassword(password, pass)) {
                return done(null, false)
            }
            return done(null, username)
        })
        if (userFound === false) return done(null, false)

        function verifyPassword(password, pass) {
            return pass === password
        }
    })
)

// passport.use(
//     new LocalStrategy(
//         { usernameField: 'username' },
//         (username, password, done) => {
//             console.log('username: %s, password: %s', username, password)
//             client.get(username, (err, pass) => {
//                 console.log('pass = ', pass)
//                 if (err) console.error(err)

//                 if (pass === password) {
//                     console.log('Password correct')
//                     return done(null, username)
//                 } else {
//                     console.log('Password (%s) incorrect', password)
//                     return done(null, false, {
//                         message: 'Incorrect username.'
//                     })
//                 }
//             })
//         }
//     )
// )

passport.serializeUser((user, done) => {
    console.log('Inside serializeUser callback, user = ', user)
    done(null, user)
})

passport.deserializeUser(function(user, done) {
    client.get(user, (err, foundUser) => {
        console.log('found user: ', foundUser)
        if (err) return done(null, err)
        done(null, foundUser)
    })
})

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(
    session({
        secret: 'esmaesqishpants',
        genid: req => {
            console.log(
                'Inside the session middleware, session ID',
                req.sessionID
            )
            return uuid() // use UUIDs for session IDs
        },
        // create new redis store.
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
    console.log('DId it work?')
    res.sendFile(path.resolve(__dirname, 'dist', 'chat.html'))
    app.use(express.static(path.resolve(__dirname, 'dist')))
})

app.get('/login', (req, res) => {
    console.log('GET login')
    res.sendFile(path.resolve(__dirname, 'login', 'login.html'))
})

app.post(
    '/login',
    passport.authenticate('local', { failureRedirect: '/login' }),
    function(req, res) {
        res.redirect('/')
    }
)

app.get('/logout', function(req, res) {
    console.log('logging out ')
    req.logout()
    res.redirect('/')
})

app.get('/whoami', (req, res) => {
    console.log('Requesting whoami')
    res.status(200).send({ data: req.session })
})

io.on('connection', socket => {
    socket.on('chat message', msg => {
        console.log('received ', user)
        io.emit('chat message', { ...msg, user })
    })
    socket.on('disconnect', () => console.log('Socket disconnected'))
})

http.listen(3000, function() {
    console.log('listening on port:3000')
})
