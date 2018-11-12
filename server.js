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
const seedDB = require('./server_modules/seedDB')
const passport = require('passport')

const LocalStrategy = require('passport-local').Strategy

const client = redis.createClient()

client.on('connect', () => {
    seedDB(client)
})

// configure passport.js to use the local strategy
passport.use(
    new LocalStrategy(
        { usernameField: 'username' },
        (username, password, done) => {
            console.log('checking password from %s', username)
            console.log(client.hexists(username))
            if (client.hexists(username)) {
                client.hget('users', username, (err, pass) => {
                    console.log('user exists')
                    if (err) console.error(err)

                    if (pass === password) {
                        console.log('Password correct')
                        return done(null, username)
                    } else {
                        console.log('Password (%s) incorrect', password)
                        return done(null, false, {
                            message: 'Incorrect username.'
                        })
                    }
                })
            }
        }
    )
)

// tell passport how to serialize the user
passport.serializeUser((user, done) => {
    console.log('Inside serializeUser callback, user = ', user)
    done(null, user)
})

passport.deserializeUser(function(user, done) {
    client.hget('users', user, (err, foundUser) => {
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

app.get('/', (req, res) => {
    console.log(`1 / 7. User authenticated? ${req.isAuthenticated()}`)
    if (req.isAuthenticated()) {
        console.log('8. Authenticated, send app')
        res.redirect('/chatbox')
    } else {
        console.log('2. Not authenticated, sending login page')
        res.redirect('/login')
    }
})

app.post(
    '/login',
    passport.authenticate('local', {
        successRedirect: '/chatbox',
        failureRedirect: '/login'
    })
)

app.get('/logout', function(req, res) {
    console.log('logging out ', req.session)
    req.logout()
    res.redirect('/')
})

app.get('/login', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'login', 'login.html'))
})

app.get('/chatbox', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'chat.html'))
})
app.use('/', express.static(path.resolve(__dirname, 'dist')))

io.on('connection', socket => {
    socket.on('chat message', msg => {
        console.log('received ', user)
        io.emit('chat message', { ...msg, user })
    })
    socket.on('disconnect', () => console.log(user + ' disconnected'))
})

http.listen(3000, function() {
    console.log('listening on port:3000')
})
