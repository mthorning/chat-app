const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
})
app.use(express.static(__dirname + '/public'))

io.on('connection', socket => {
    console.log('a user connected')
    socket.on('chat message', msg => {
        io.emit('chat message', msg)
    })
    socket.on('disconnect', () => console.log('user disconnected'))
})

http.listen(3000, function() {
    console.log('listening on *:3000')
})
