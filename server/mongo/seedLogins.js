const UserModel   = require('./models/User')
const users       = require('./users.json')
const password    = require('password-hash-and-salt')

module.exports = () => {
    return new Promise((resolve, reject) => {
        //create new accounts for any users in array which are not
        //in the DB
        users.forEach(user => findUser(user, resolve, reject))
    })
}

function findUser(user, resolve, reject) {
    UserModel.find({ username: user }, (err, docs) => {
        if (err) reject(err)

        if (!docs.length) createUser(user, resolve, reject)
        resolve(null)
    })
}

function createUser(user, resolve, reject) {
    password(user).hash(function(err, hash) {
        if(err) reject(err)
        UserModel.create(
            {
                username: user,
                password: hash,
                newUser: true
            },
            err => {
                if (err) reject(err)
                console.info('Record created for %s.', user)
                resolve(null)
            }
        )
    })
}