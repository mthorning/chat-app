const UserModel = require('./models/User')
const users = require('./users.json')

module.exports = () => {
    return new Promise((resolve, reject) => {
        let promises = new Array(users.length)

        users.forEach(user => {
            promises.push(
                new Promise((resolve, reject) => {
                    UserModel.find({ username: user }, (err, docs) => {
                        if (err) reject(err)

                        if (!docs.length) {
                            UserModel.create(
                                {
                                    username: user,
                                    password: user,
                                    newUser: true
                                },
                                err => {
                                    if (err) reject(err)
                                    console.log('Record created for %s.', user)
                                    resolve()
                                }
                            )
                        } else {
                            resolve()
                        }
                    })
                })
            )
        })
        Promise.all(promises).then(
            () => resolve(false),
            err => reject(true, err)
        )
    })
}
