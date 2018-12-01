function check(err) {
    if (err) console.error(err)
}

module.exports = (client, io) => socket => {
    let username

    socket.on('user connected', packet => {
        client.sadd('onlineUsers', packet.displayName, () => sendOnlineUsers())
    })

    socket.on('chat message', packet => {
        let responsePacket = { ...packet }
        io.emit('chat message', responsePacket)
    })

    socket.on('disconnect', () => {
        client.srem('onlineUsers', username, err => {
            check(err)
            sendOnlineUsers()
        })
    })

    function sendOnlineUsers() {
        client.smembers('onlineUsers', (err, list) => {
            check(err)
            console.log(list)
            io.emit('online users', list)
        })
    }
}
