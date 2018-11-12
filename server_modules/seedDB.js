const users = require('./users')

module.exports function (client) {
    for (let user in users) {
        client.hmset('users', user, JSON.stringify(users[user]))
    }
}
