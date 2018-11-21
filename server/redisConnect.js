function check(err) {
    if (err) console.error(err)
}

module.exports = client => {
    client.on('connect', () => {
        const users = require('./users.json')
        console.log('Redis Connected')

        for (let user in users) {
            client.hset('passwords', user, users[user].password, check)

            for (let attr in users[user].data) {
                client.hset(user, attr, users[user].data[attr], check)
            }
        }
        client.del('onlineUsers')
    })

    client.on('error', err => console.error('Error connecting to DB', err))
}
