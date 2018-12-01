const UserModel = require('./models/User')
const users = require('./users.json')

module.exports = () => {
    return new Promise((resolve, reject) => {
        //create new accounts for any users in array which are not
        //in the DB
        users.forEach(user => {
            UserModel.find({ username: user }, (err, docs) => {
                if (err) reject(err)

                if (!docs.length) {
                    UserModel.create(
                        {
                            username: user,
                            password: user,
                            newUser: true
                        },
                        (err, record) => {
                            if (err) reject(err)
                            console.info('Record created for %s.', user)
                            console.log(record)
                        }
                    )
                }
                resolve(null)
            })
        })
    })
}
