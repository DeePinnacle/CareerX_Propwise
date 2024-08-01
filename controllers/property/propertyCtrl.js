const mongoose = require("mongoose")
const {
    propsModel
} = require('../../model/propertySchema')
const {
    propertyTransactionModel
} = require("../../model/propsTransactionSchema")

const {
    userModel
} = require("../../model/userSchema")


// get all properties
const handleGetAllProps = async(req, res) => {
    try{
        const properties = await propsModel.find()

        if(!properties.length > 0){
            return res.status(400).json({ message: 'No property listing yet.' })
        }

        return res.status(200).json({ message: "loaded properties successfully", properties })

    }catch(error){
        return res.status(400).json({ message: error.message })
    }
}

// get single property details
const handlePropsDetails = async(req, res)=>{
    try {
        const { id } = req.params
        
        if(!id){
            return res.status(400).json({ message: "Error loading details." })
        }
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({ message: "Invalid prop ID provided" })
        }

        const details = await propsModel.findById(id)

        if(!details){
            return res.status(400).json({ message: "An error occurred." })
        }
        return res.status(200).json({ message: "Details loaded successfully", details })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

// search property by state 

const handleByState = async(req, res)=>{
    try {
        let { state } = req.params

        if(!state){
            return res.status(400).json({ message: "Enter search location" })
        }

        // capitalize user search params
        state = `${ state.charAt(0).toUpperCase()}${ state.slice(1).toLowerCase()}`

        const search = await propsModel.find({ state })

        if(!search){
            return res.status(400).json({ message: "No result found" })
        }
        if(!search.length > 0){
            return res.status(400).json({ message: "No property found from that state." })
        }

        return res.status(200).json({  message: "Query successful", count: search.length, search, state })

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

// search by city
const handleByCity = async(req, res)=>{
    try {
        let { city } = req.params

        if(!city){
            return res.status(400).json({ message: "Enter search city" })
        }

        // capitalize user search params
        city = `${ city.charAt(0).toUpperCase()}${ city.slice(1).toLowerCase()}`

        const search = await propsModel.find({ city })

        if(!search){
            return res.status(400).json({ message: "No result found" })
        }

        if(!search.length > 0){
            return res.status(400).json({ message: "No result found from that city." })
        }

        return res.status(200).json({  message: "Query successful", count: search.length, search, city })

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

// filter by price
const handleByPrice = async(req, res)=>{
    try {
        const { price } = req.params
        
        if(!price){
            return res.status(400).json({ message: "Enter price to be filtered." })
        }

        const search = await propsModel.find({ price })

        if(!search.length > 0){
            return res.status(400).json({ message: "No property available for that price" })
        }
        return res.status(200).json({ message: "Query successful", search })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

// handle Buy property
const handleBuyProps = async(req, res)=>{
    try {
        const { id } = req.user
        const { payment_choice, propsID } = req.params

        // get user 
        const user = await userModel.findById(id)
        // get property
        const property = await propsModel.findById(propsID)

        // check if user

        if(!user){
            return res.status(400).json({ message: 'No user found' })
        }

        if(!property){
            return res.status(400).json({ message: "No property found with such id." })
        }

        if(user.active === false){
            return res.status(400).json({ message: "user account deactivated." })
        }

        if(property.prop_status === "sold"){
            return res.status(400).json({ message: "Property not available for purchase." })
        }

        if(payment_choice === "Full-payment" ){
            if(user.account_balance < property.price || user.account_balance === 0){
                return res.status(400).json({ message: "Insufficient balance, fund account to purchase property." })
            }
    
            // deduct selling price from user balance
            let balance = user.account_balance
            balance -= property.price
    
            // update user balance
            const update_balance = await userModel.findByIdAndUpdate(id, {
                account_balance: balance
            }, { new: true })
            
            const propsTransaction = new propertyTransactionModel({
                purchased_by: id,
                property_id: propsID,
                amount: property.price,
                payment_choice
            })
    
            await propsTransaction.save()
    
            // update property status
            const updatePropStatus = await propsModel.findByIdAndUpdate(propsID, {
                prop_status: "sold"
            }, { new: true })
    
            return res.status(200).json({ message: "Successful", propsTransaction })
        }

        // pay installmentally 


    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}


module.exports = {
    handleGetAllProps,
    handlePropsDetails,
    handleByState,
    handleByCity,
    handleByPrice,
    handleBuyProps
}