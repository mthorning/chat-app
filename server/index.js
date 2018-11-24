const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const uuid = require('uuid/v4')
const flash = require('connect-flash')

const app = express()

const http = require('http').Server(app)
const io = require('socket.io')(http)
const socketFuncs = require('./socket')

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(
    session({
        secret: 'esmaesqishpants',
        genid: req => uuid(),
        store: new MongoStore({
            url: 'mongodb://localhost:27017/session-store'
        }),
        resave: false,
        saveUninitialized: true
    })
)

app.use(flash())

const mongo = require('./mongo/connect')
    .then(() => {
        const passport = require('./passport')(mongo)
        app.use(passport.initialize())
        app.use(passport.session())

        const socketWithClient = socketFuncs(mongo, io)
        io.on('connection', socketWithClient)

        require('./appRoutes')(express, app, passport, mongo)
        http.listen(9912, () => console.log('Listening on port 9912'))
    })
    .catch(err => console.error(err))
