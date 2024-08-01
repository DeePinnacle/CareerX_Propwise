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
        enum: ['Full-payment', 'Installment'],
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

const propertyTransactionModel = mongoose.model('props_transaction', propertyTransaction)

module.exports = {
    propertyTransactionModel
}
