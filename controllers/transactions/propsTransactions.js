// This apis handles all users properties transactions

const { userModel } = require("../../model/userSchema")
const {
    propertyTransactionModel
} = require("../../model/propsTransactionSchema")
const{
    propsModel
} = require("../../model/propertySchema")
const { default: mongoose } = require("mongoose")

// get all logged i users property transactions
const getAllUsersTransaction = async(req, res) => {
    try {
        const { id } = req.user
        const user = await userModel.findById(id)

        if(!user){
            return res.status(400).json({ message: "User not found." })
        }

        // check if user account is active 
        if(user.active === false){
            return res.status(400).json({ message: "User account deactivated." })
        }

        // get transactions
        const transactions = await propertyTransactionModel.find({ purchased_by: id }).sort({ createdAt: -1 })

        if(!transactions){
            return res.status(500).json({ message: "Error fetching users transactions." })
        }

        if(!transactions.length > 0){
            return res.status(400).json({ message: "No property purchased yet." })
        }

        return res.status(200).json({ message: "Fetch successful", transactions })
        
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}
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
        const cancelPropPurchase = await propertyTransactionModel.findOneAndDelete({ property_id: props_id })

        if(!cancelPropPurchase){
            return res.status(400).json({ message: "Error cancelling property purchase." })
        }

        return res.status(200).json({ message: "Property purchase cancelled successfully." })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

module.exports = {
    getAllUsersTransaction,
    cancelPurchase
}