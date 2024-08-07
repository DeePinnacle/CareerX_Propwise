const mongoose = require('mongoose')

const Schema = mongoose.Schema

const adminSchema = new Schema({
    username: {
        type: String,
        required: true, 
        unique: true
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
    account_number: {
        type: Number,
        default: 1234567890
    },
    account_balance: {
        type: Number,
        default: 0
    },
    role: {
        type: String,
        default: "admin"
    }
}, { timestamps: true })

const adminModel = mongoose.model('admin', adminSchema)

module.exports = {
    adminModel
}