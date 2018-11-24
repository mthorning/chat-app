const mongoose = require('mongoose')

userSchema = new mongoose.Schema({
    username: String,
    password: String,
    newUser: Boolean
})

module.exports = mongoose.model('users', userSchema)
