const {
    userModel
} = require ('../model/userSchema')

const mongoose = require('mongoose')

const Schema = mongoose.Schema

const walletSchema = new Schema({
    _by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    amount: {
        type: Number,
        required: true,
        default: 0
    },
    description: {
        type: String,
        required: true
    },
    wallet_balance: {
        type: Number
    },
    action: {
        type: String,
        enum: ['Fund', 'Withdraw']
    }
}, { timestamps: true })

const walletModel = mongoose.model('wallet', walletSchema)

module.exports = {
    walletModel
}