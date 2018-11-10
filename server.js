const path = require('path')
const express = require('express')
const redis = require('redis')
const session = require('express-session')
const redisStore = require('connect-redis')(session)
const client = redis.createClient()
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const bodyParser = require('body-parser')

const users = require('./server_modules/users')
client.on('connect', () => {
    console.log('Redis connected, seeding users...')
    client.hmset('users', users)
    client.hgetall('users', (err, hash) => {
        if (err) console.error(err)
        console.log(hash)
    })
})

app.use(
    session({
        secret: 'esmaesqishpants',
        // create new redis store.
        store: new redisStore({
            host: 'localhost',
            port: 6379,
            client: client,
            ttl: 260
        }),
        saveUninitialized: false,
        resave: false
    })
)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// app.set('views', __dirname + '/views');
// app.engine('html', require('ejs').renderFile);

app.post('/attemptLogin', function(req, res) {
    console.log('%s attempting login ', req.body.username)
    if (client.hexists(req.body.username)) {
        client.hget('users', req.body.username, (error, pass) => {
            console.log(
                'checking password "%s" against "%s"',
                req.body.password,
                pass
            )
            if (pass === req.body.password) {
                // when user login set the key to redis.
                req.session.key = req.body.username
                console.log('key set %s', req.session.key)
            }
        })
    } else {
        console.log('key not set ', req.body.username)
        console.log(client.hexists(req.body.username))
        console.log('pass: ', client.hget('users', req.body.username))
        res.status(403).body('Permission Denied')
    }
})

app.get('/logout', function(req, res) {
    req.session.destroy(function(err) {
        if (err) {
            console.log(err)
        } else {
            res.redirect('/')
        }
    })
})

app.use('/chatbox', express.static(path.resolve(__dirname, 'dist', 'chatbox')))
app.use('/login', express.static(path.resolve(__dirname, 'login')))

app.use('/', function(req, res) {
    if (req.session && req.session.key) {
        res.redirect('/chatbox')
    } else {
        res.redirect('/login')
    }
})

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
