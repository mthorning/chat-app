const basicAuth = require('basic-auth')
const sanitizeString = require('./sanitizeString')

module.exports = redis =>
    function(req, res, next) {
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

        redis.hgetall('users', (err, users) => {
            if (err) {
                console.error(err)
            } else {
                if (users[name] && users[name] === pass) {
                    redis.set('currentUser', name, redis.print)
                    return next()
                } else {
                    return unauthorized(res)
                }
            }
        })
    }
