const mongoose   = require('mongoose')
const seedLogins = require('./seedLogins')
const mongoUrl = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017'

module.exports = new Promise(async (resolve, reject) => {
    const mongoDB = `${mongoUrl}/squishychat`
    mongoose.connect(
        mongoDB,
        { useNewUrlParser: true }
    )
    mongoose.Promise = global.Promise
    const db         = mongoose.connection

    db.on('error', err => reject('MongoDB connection error:' + err))

    console.log('Checking users collection')
    const err = await seedLogins()
    if (err) reject(err)

    console.log('Users collection is up-to-date')
    resolve(db)
})
