const mongoose = require('mongoose')

userSchema = new mongoose.Schema({
    id: String,
    displayName: String,
    newUser: Boolean
})

module.exports = mongoose.model('users', userSchema)
