const mongoose = require("mongoose")

const Schema = mongoose.Schema

const userSchema = new Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phonenumber: {
        type: String,
        required: true
    },
    profile_pics: {
        type: String
    },
    account_number: {
        type: Number,
        required: true,
    },
    account_balance: {
        type: Number,
        default: 0
    },
    verified: {
        type: Boolean,
        default: false
    },
    active : {
        type: Boolean,
        default: true
    },
    suspended: {
        type: Boolean,
        default: false
    },
    status: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        default: 'user'
    }

}, { timestamps: true  })


const userModel = mongoose.model('user', userSchema)

module.exports = {
    userModel
}
