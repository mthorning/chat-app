function check(err) {
    if (err) console.error(err)
}

module.exports = (client, io) => socket => {
    let username

    socket.on('user connected', packet => {
        username = packet.username
        client.sadd('onlineUsers', username, () => sendOnlineUsers())
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
            const userDisplayNames = []
            list.forEach(onlineUser => {
                userDisplayNames.push(
                    new Promise((resolve, reject) => {
                        client.hget(onlineUser, 'displayName', (err, name) => {
                            if (err) reject(err)
                            resolve(name)
                        })
                    })
                )
            })
            Promise.all(userDisplayNames).then(
                res => {
                    io.emit('online users', res)
                },
                err => check(err)
            )
        })
    }
}
