const redis = require('redis')

module.exports = () => {
    const client = redis.createClient()

    client.on('connect', function() {
        console.log('Redis connected')
    })

    client.on('error', err => console.error(err))

    client.hmset('users', ['matt', 'password', 'esmae', 'coco&bonobo'])
    return client
}
