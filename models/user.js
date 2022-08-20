const mongoose = require('mongoose')
const Schema = mongoose.Schema
const crypto = require('crypto')
const config = require('../config')

const User = new Schema({
    email: {type: String, unique: true},
    password: String,
})

// create new User document
User.statics.create = function(email, password) {
    const encrypted = crypto.createHmac('sha1', config.secret)
                      .update(password)
                      .digest('base64')

    const user = new this({
        email,
        password: encrypted
    })

    // return the Promise
    return user.save()
}

// find one user by using username
User.statics.findOneByEmail = function(email) {
    return this.findOne({
        email
    }).exec()
}

// verify the password of the User documment
User.methods.verify = function(password) {
    const encrypted = crypto.createHmac('sha1', config.secret)
                      .update(password)
                      .digest('base64')

    return this.password === encrypted
}

module.exports = mongoose.model('User', User)