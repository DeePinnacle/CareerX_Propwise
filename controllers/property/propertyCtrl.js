const mongoose = require("mongoose")
const {
    propsModel
} = require('../../model/propertySchema')
const {
    propertyTransactionModel,
    InstallmentalModel
} = require("../../model/propsTransactionSchema")

const {
    userModel
} = require("../../model/userSchema")
const { adminModel } = require("../../model/adminSchema")


// get all properties
const handleGetAllProps = async(req, res) => {
    try{
        const properties = await propsModel.find().sort({ createdAt: -1 })

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

// handle Buy property full payment
const handleBuyProps = async(req, res)=>{
    try {
        const { id } = req.user
        const { propsID } = req.params

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

        // update admin account balance 
        let admin = await adminModel.find()
        // set admin id 
        let admin_id = admin[0]._id

        let adminAccount = admin[0].account_balance

        adminAccount = Number(adminAccount) + Number(property.price)        

        const updateAdminAccount = await adminModel.findOneAndUpdate({ _id: admin_id },
            {
                account_balance: adminAccount
            },
            { 
                new: true
            }
        )
        
        const propsTransaction = new propertyTransactionModel({
            purchased_by: id,
            property_id: property._id,
            amount: property.price,
        })

        await propsTransaction.save()

        // update property status
        const updatePropStatus = await propsModel.findByIdAndUpdate(propsID, {
            prop_status: "sold"
        }, { new: true })

        if(!updateAdminAccount){
            return res.status(500).json({ message: "Error updating admin balance." })
        }

        if(!update_balance){
            return res.status(400).json({ message: "Error updating user balance." })
        }

        if(!updatePropStatus){
            return res.status(400).json({ message: "Error updating props status" })
        }

        return res.status(200).json({ message: "Successful", propsTransaction })


    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

// handle Installmental payment
const handleInstallmentalPurchase = async(req, res) => {
    try {   
        const { id } = req.user
        const { propsID } = req.params
        const{ downPayment } = req.body

        // get user 
        const user = await userModel.findById(id)

        // get property
        const property = await propsModel.findOne({_id: propsID})

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

        if(!downPayment){
            return res.status(400).json({ message: "Enter at least 50% down payment of the property." })
        }

        // get property price
        const propsPrice = property.price

        // get 50% of props price
        let pricePercentage = (50/100 * Number(propsPrice))
        // check if downpayment is at least 50% of property
        if(downPayment < pricePercentage){
            return res.status(400).json({ message: "Your downpament is lesser than 50%", pricePercentage })
        }

        if(user.account_balance < property.price || user.account_balance === 0){
            return res.status(400).json({ message: "Insufficient balance, fund account to purchase property." })
        }

        // deduct payment from users wallet
        let balance = user.account_balance
        balance -= downPayment

        // balance left to be paid
        let balanceLeft = Number(propsPrice) - Number(downPayment)

        // spread balance across 2 months
        let spreadBalance = (Number(balanceLeft / 2))

        let first_month = spreadBalance
        let second_month = spreadBalance

        // update user balance
        const update_balance = await userModel.findByIdAndUpdate(id, {
            account_balance: balance
        }, { new: true })

        // save to user installmental schema
        const InstallmentalPayment = new InstallmentalModel({
            _by: id,
            property: property._id,
            down_payment: downPayment,
            balance_left: balanceLeft,
            first_month,
            second_month,
        })

       await InstallmentalPayment.save()
       
               // update property status
               const updatePropStatus = await propsModel.findByIdAndUpdate(propsID, {
                prop_status: "sold"
            }, { new: true })

            
        // update admin account balance 
        let admin = await adminModel.find()
        // set admin id 
        let admin_id = admin[0]._id

        let adminAccount = admin[0].account_balance

        adminAccount = Number(adminAccount) + Number(downPayment)        

        const updateAdminAccount = await adminModel.findOneAndUpdate({ _id: admin_id },
            {
                account_balance: adminAccount
            },
            { 
                new: true
            }
        )

            if(!updateAdminAccount){
                return res.status(400).json({ message: "Error updating admin balance." })
            }
    
            if(!update_balance){
                return res.status(400).json({ message: "Error updating user balance." })
            }
    
            if(!updatePropStatus){
                return res.status(400).json({ message: "Error updating props status" })
            }


        return res.status(200).json({ message: "Installment payment initiated successfully", InstallmentalPayment })

        

    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

// Edit installmental down payment
// const handleInstallmentalEdit = async(req, res) => {
//     try {
//         const { id } = req.user
//         const { propsID } = req.params
//         const{ downPayment } = req.body

//         // get user 
//         const user = await userModel.findById(id)
//         // get property
//         const property = await propsModel.findById(propsID)

//         // check if user

//         if(!user){
//             return res.status(400).json({ message: 'No user found' })
//         }

//         if(!property){
//             return res.status(400).json({ message: "No property found with such id." })
//         }

//         if(user.active === false){
//             return res.status(400).json({ message: "user account deactivated." })
//         }

//         if(!downPayment){
//             return res.status(400).json({ message: "Enter at least 50% down payment of the property." })
//         }
//     } catch (error) {
//         return res.status(500).json({ message: error.message })
//     }
// }

// cancel a single property purchased
const cancelPurchase = async(req, res)=>{
    try {
        const { id } = req.user
        const { props_id } = req.params
        // check user 
        const user = await userModel.findById(id)
        if(!user){
            return res.status(400).json({ message: "user not found." })
        }
        if(user.active === false){
            return res.status(400).json({ message: "User account deactivated." })
        }
        // check props
        const props = await propertyTransactionModel.findOne({ property_id: props_id })
        if(!props){
            return res.status(400).json({ message: "Property with id not found" })
        }

        // get user wallet balance
        let wallet = user.account_balance
        let props_amount = props.amount
        wallet = Number(wallet) + Number(props_amount)

        // update user wallet balance 
        const updateUserBalance = await userModel.findByIdAndUpdate(id,{
            account_balance: wallet
        }, { new: true })

        // update admin account balance 
        let admin = await adminModel.find()
        // set admin id 
        let admin_id = admin[0]._id

        let adminAccount = admin[0].account_balance

        adminAccount = Number(adminAccount) - Number(props_amount)
        

        const updateAdminAccount = await adminModel.findOneAndUpdate({ _id: admin_id },
            {
                account_balance: adminAccount
            },
            { 
                new: true
            }
        )

        // update property status
        const propStatus = await propsModel.findByIdAndUpdate(props_id, {
            prop_status: "available"
        }, { new: true })

        if(!updateAdminAccount){
            return res.status(400).json({ message: "Error updating admin balance." })
        }

        if(!updateUserBalance){
            return res.status(400).json({ message: "Error updating status." })
        }

        if(!propStatus){
            return res.status(400).json({ message: "Error updating property status." })
        }

        // delete property from user transaction 
        const cancelPropPurchase = await propertyTransactionModel.findOneAndDelete({ property_id: props_id })

        if(!cancelPropPurchase){
            return res.status(400).json({ message: "Error cancelling property purchase." })
        }

        return res.status(200).json({ message: "Property purchase cancelled successfully." })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

// cancel installmental payment
const handleCancelInstallmentalPay = async(req, res)=>{
    try {
        const { id } = req.user
        const { props_id } = req.params
        // check user 
        const user = await userModel.findById(id)

        if(!user){
            return res.status(400).json({ message: "user not found." })
        }
        if(user.active === false){
            return res.status(400).json({ message: "User account deactivated." })
        }
        // check props
        const props = await InstallmentalModel.findOne({ property: props_id })
        if(!props){
            return res.status(400).json({ message: "Property with id not found" })
        }
        // query user downpayment
        let installmentalUserQuery = await InstallmentalModel.findOne({ _by: id })

        let downPayment = installmentalUserQuery.down_payment

        // get user wallet balance
        let wallet = user.account_balance
        wallet = Number(wallet) + Number(downPayment)

        // update user wallet balance 
        const updateUserBalance = await userModel.findByIdAndUpdate(id,{
            account_balance: wallet
        }, { new: true })

        // update admin account balance 
        let admin = await adminModel.find()
        // set admin id 
        let admin_id = admin[0]._id

        let adminAccount = admin[0].account_balance

        adminAccount = Number(adminAccount) - Number(downPayment)
        

        const updateAdminAccount = await adminModel.findOneAndUpdate({ _id: admin_id },
            {
                account_balance: adminAccount
            },
            { 
                new: true
            }
        )

        // update property status
        const propStatus = await propsModel.findByIdAndUpdate(props_id, {
            prop_status: "available"
        }, { new: true })

        if(!updateUserBalance){
            return res.status(400).json({ message: "Error updating status." })
        }

        if(!propStatus){
            return res.status(400).json({ message: "Error updating property status." })
        }

        // delete property from user transaction 
        const cancelPropPurchase = await InstallmentalModel.findOneAndDelete({ property_id: props_id })

        if(!cancelPropPurchase){
            return res.status(400).json({ message: "Error cancelling property purchase." })
        }

        return res.status(200).json({ message: "Installmental purchase cancelled successfully." })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}


// handle all transactions / full-pay and installmental
const handleAllTransactions = async(req, res) =>{
    try {
        const { id } = req.user
        const user = await userModel.findById(id)

        if(!user){
            return res.status(400).json({ message: "user not found." })
        }

        // check if user account is active 
        if(user.active === false){
            return res.status(400).json({ message: "User account deactivated." })
        }

        // full paymanet transactions 
        const fullPayment = await propertyTransactionModel.find({ purchased_by: id }).sort({ createdAt: -1 })
        .populate({ path: 'property_id', select: ['title', 'price']})

        // query installmental tansactions 
        const installmentalPayment = await InstallmentalModel.find({ _by: id }).sort({ createdAt: -1 })
        .populate({ path: 'property', select: ['title', 'price']})

        // set to an object

        const transactions = {
            fullPayment,
            installmentalPayment
        }

        if(!transactions.length <= 0){
            return res.status(400).json({ message: "Transaction History is empty" })
        }

        return res.status(200).json({ message: "Query successful", transactions })


    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

// delete a particular transaction from history 
const deleteSingleTransactionHistory = async(req, res)=>{
    try {
        const { transaction_id } = req.params
        if(!mongoose.Types.ObjectId.isValid(transaction_id)){
            return res.status(400).json({ message: 'Invalid ID' })
        }

        const fullPayment = await propertyTransactionModel.findByIdAndDelete(transaction_id)
        const installmentalPayment = await InstallmentalModel.findByIdAndDelete(transaction_id)
        
        return res.status(200).json({ message: "Transaction successfully deleted" })
        

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}


module.exports = {
    handleGetAllProps,
    handlePropsDetails,
    handleByState,
    handleByCity,
    handleByPrice,
    handleBuyProps,
    handleInstallmentalPurchase,
    cancelPurchase,
    handleCancelInstallmentalPay,
    handleAllTransactions,
    deleteSingleTransactionHistory
}