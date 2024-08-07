const mongoose = require('mongoose')

const {
    propsModel
} = require("./propertySchema")

const {
    userModel
} = require("./userSchema")

const Schema = mongoose.Schema

const propertyTransaction = new Schema({
    purchased_by: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    }],
    property_id: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "property",
        required: true
    }],
    amount: {
        type: mongoose.Schema.Types.Decimal128,
        required: true
    },
    payment_choice:{
        type: String,
        default: 'Full-payment',
    },
    date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'cancelled'],
        default: 'pending'
    }
}, { timestamps: true })

const installmentalPaymentSchema = new Schema({
    _by:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    property: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'property',
        required: true
    },
    down_payment: {
        type: Number,
        default: 0,
        required: true
    },
    balance_left: {
        type: Number,
        default: 0
    },
    first_month:{
        type: Number,
        default: 0
    },
    second_month: {
        type: Number,
        default: 0
    },
    payment_period: {
        type: String,
        default: "2 months"
    },
    payment_choice: {
        type: String,
        default: 'Installmental'
    },
    payment_method: {
        type: String,
        default: 'wallet'
    },
    status:{
        type: String,
        enum: ['pending', 'approved', 'cancelled'],
        default: 'pending'
    },
    date: {
        type: Date,
        default: Date.now
    }
})

const InstallmentalModel = mongoose.model('intallmentTransaction', installmentalPaymentSchema)

const propertyTransactionModel = mongoose.model('props_transaction', propertyTransaction)

module.exports = {
    propertyTransactionModel,
    InstallmentalModel
}
