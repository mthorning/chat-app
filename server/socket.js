const UserModel   = require('./mongo/models/User')

module.exports = io => socket => {

    let userId

    socket.on('user connected', packet => {
        userId = packet.id
        console.log('user id', userId)
        UserModel.findByIdAndUpdate(
            userId,
            { $set: { online: true } },
            err => {
                if(err) console.error(err)
                sendOnlineUsers()
            }
        )
    })

    socket.on('chat message', packet => {
        let responsePacket = { ...packet }
        io.emit('chat message', responsePacket)
    })

    socket.on('disconnect', () => {
        UserModel.findByIdAndUpdate(
            userId,
            { $set: { online: false } },
            err => {
                if(err) console.error(err)
                sendOnlineUsers()
            }
        )
    })

    function sendOnlineUsers() {
        UserModel
            .find({ online: true }, (err, users) => {
                if(err) console.error(err)
                console.log('online: ', users)
                io.emit('online users', users)
            })
    }
}
