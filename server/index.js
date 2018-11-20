const redisUrl = process.env.REDIS_URL || ''
const redis = require('redis')
const client = redis.createClient(redisUrl)
require('./redisConnect')(client)

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const session = require('express-session')
const redisStore = require('connect-redis')(session)
const uuid = require('uuid/v4')

// const devStoreOptions = {
//     host: 'localhost',
//     port: 6379,
//     client,
//     ttl: 260
// }

// const chosenOptions = container ? containerStoreOptions : devStoreOptions
app.use(
    session({
        secret: 'esmaesqishpants',
        genid: req => uuid(),
        store: new redisStore({
            client
        }),
        resave: false,
        saveUninitialized: true
    })
)

const passport = require('./passport')(client)
app.use(passport.initialize())
app.use(passport.session())

const http = require('http').Server(app)
const io = require('socket.io')(http)
const socketFuncs = require('./socket')
const socketWithClient = socketFuncs(client, io)
io.on('connection', socketWithClient)

require('./appRoutes')(express, app, passport, client)
http.listen(9912, () => console.log('Listening on port 9912'))
