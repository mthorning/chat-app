function check(err) {
    if (err) console.error(err)
}

module.exports = redis => {
    redis.on('connect', () => {
        console.log('Redis Connected')
    })

    redis.on('error', err => console.error('Error connecting to DB', err))
}
