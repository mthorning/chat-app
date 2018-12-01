const redisUrl    = process.env.REDIS_URL || ''
const express     = require('express')
const path        = require('path')
const bodyParser  = require('body-parser')
const session     = require('express-session')
const redis       = require('redis')
const redisClient = redis.createClient(redisUrl)
const redisStore  = require('connect-redis')(session)

require('./redisConnect')(redisClient)

const uuid        = require('uuid/v4')
const flash       = require('connect-flash')
const app         = express()
const http        = require('http').Server(app)
const io          = require('socket.io')(http)
const socketFuncs = require('./socket')

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(
    session({
        saveUninitialized: true,
        secret           : 'esmaesqishpants',
        genid            : req => uuid(),
        resave           : false,
        store            : new redisStore({ redisClient })
    })
)

app.use(flash())

const mongo = require('./mongo/connect')
    .then(() => {
        const passport = require('passport')
        app.use(passport.initialize())
        app.use(passport.session())
        require('./passportStrategy')(passport)

        const socketWithRedis = socketFuncs(redisClient, io)
        io.on('connection', socketWithRedis)

        require('./appRoutes')(express, app, passport, mongo)
        http.listen(9912, () => console.log('Listening on port 9912'))
    })
    .catch(err => console.error(err))
