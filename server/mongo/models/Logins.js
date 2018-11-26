const mongoose = require('mongoose')

loginSchema = new mongoose.Schema({
    username: String,
    password: String,
})

module.exports = mongoose.model('logins', loginSchema)
