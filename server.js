const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const basicAuth = require('basic-auth')
const bodyParser = require('body-parser')

app.use(bodyParser.json())

function sanitizeString(string) {
    if (string && typeof string === 'string') {
        return string
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;')
            .trim()
            .toLowerCase()
    }
    return false
}

const logins = {
    matt: 'password',
    esmae: 'coco&bonobo'
}

const auth = function(req, res, next) {
    function unauthorized(res) {
        res.set('WWW-Authenticate', 'Basic realm=Authorization Required')
        return res.send(401)
    }

    const user = basicAuth(req)
    const name = sanitizeString(user && user.name)
    const pass = sanitizeString(user && user.pass)

    if (!user || !name || !pass) {
        return unauthorized(res)
    }

    if (logins[name] && logins[name] === pass) {
        return next()
    } else {
        return unauthorized(res)
    }
}

app.use('/', auth, express.static(__dirname + '/dist'))

io.on('connection', socket => {
    socket.on('chat message', msg => {
        io.emit('chat message', msg)
    })
    socket.on('disconnect', () => console.log('user disconnected'))
})

http.listen(3000, function() {
    console.log('listening on port:3000')
})
