const LoginsModel = require('./models/Logins')
const UsersModel = require('./models/Users')
const users = require('./users.json')

module.exports = () => {
    return new Promise((resolve, reject) => {
        const promises = new Array(users.length)

        //create new accounts for any users in array which are not
        //in the DB
        users.forEach(user => {
            promises.push(new Promise(async (resolve, reject) => {
                try {
                    const newLogin = await createLogin(user)
                    if(newLogin) await createUser(newLogin)
                    resolve()
                } catch(e) {
                    reject(e)
                }
            }))
        })
        Promise.all(promises).then(
            ()  => resolve(false),
            err => reject(true, err)
        )
    })
}

function createLogin(user) {
    return new Promise((resolve, reject) => {
        LoginsModel.find({ username: user }, (err, docs) => {
            if (err) reject(err)

            if (!docs.length) {
                LoginsModel.create(
                    {
                        username: user,
                        password: user,
                    },
                    (err, newUserRecord) => {
                        if (err) reject(err)
                        console.info('Record created for %s.', user)
                        resolve(newUserRecord)
                    }
                )
            } else {
                //if the DB already has the user then 
                //resolve with false
                resolve(false)
            }
        })
    })
}

function createUser(newLogin) {
    return new Promise((resolve, reject) => {
        UsersModel.remove({ id: newLogin._id }, err => {
            if(err) reject(err)
            //create new user record with newUser flag
            //for app redirect to edit page
            UsersModel.create(
                {
                    id: newLogin._id,
                    newUser: true 
                },
                err => {
                    if(err) reject(err)
                    resolve()
                }
            )
        })
    })
}
