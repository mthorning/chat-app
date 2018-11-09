const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const bodyParser = require('body-parser')
const redis = require('./server_modules/redis')()
const auth = require('./server_modules/auth')(redis)

app.use(bodyParser.json())

app.use('/', auth, express.static(__dirname + '/dist'))

io.on('connection', socket => {
    redis.get('currentUser', (err, user) => {
        if (err) {
            console.error(err)
        } else {
            socket.on('chat message', msg => {
                console.log('received ', user)
                io.emit('chat message', { ...msg, user })
            })
            socket.on('disconnect', () => console.log(user + ' disconnected'))
        }
    })
})

http.listen(3000, function() {
    console.log('listening on port:3000')
})
