const mongoose = require ("mongoose")
const {
    adminModel
} = require('../model/adminSchema')

const Schema = mongoose.Schema

const propertySchema = new Schema({
    brokered_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin',
        required: true

    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price : {
        type: mongoose.Schema.Types.Decimal128,
        required: true
    },
    acre_lot: {
        type: mongoose.Schema.Types.Decimal128
    },
    state: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    prop_status: { 
        type: String,
        enum: ["available", "sold", "rented"],
        default: "available"
    },
    prop_type: {
        type: String,
        enum: ['Residential', 
               'Commercial', 
               'Mixed-use', 
               "Victorian home", 
               "Bungalow", 
               "Farmhouse", 
               "Townhouse", 
               "Estate", 
               "Single family home"
        ],
        required: true
    },
    features: {
        type: String,
        required: true
    },
    bedrooms: {
        type: Number,
        required: false
    },
    bathrooms: {
        type: Number,
        required: false
    },
    year_built: {
        type: Number,
        required: false
    },
    image: {
        type: String,
        required: false
    },
    images: {
        type: [String],
        required: false
    }

}, { timestamps: true })

const propsModel = mongoose.model('property', propertySchema)

module.exports = {
    propsModel
}