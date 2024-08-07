const {
    userModel
} = require("../../model/userSchema")
const { walletModel } = require("../../model/walletSchema")

// const wallet details including wallet transactions history
const handleWallet = async(req, res) => {
    try {
        const { id } = req.user

        const user = await userModel.findById(id)

        // check user
        if(!user){
            return res.status(400).json({ message: "User not found" })
        }

        if(user.active === false){
            return res.status(400).json({ message: "User account deactivated." })
        }

        // set user balance
        const wallet_balance = user.account_balance

        // get wallet transactions for user
        const walletTransaction = await walletModel.find({ _by: id }).populate({ path: '_by', select:['firstname']})

        // check if wallet transaction is empty
        if(!walletTransaction. length > 0){
            return res.status(400).json({ wallet_balance, message: 'No transactions yet.' })
        }

        return res.status(200).json({ message: "Loaded successfully", wallet_balance, walletTransaction } )
        
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

// fund wallet and withdraw from wallet
const handleFundWallet = async(req, res) => {
    const { id } = req.user
    let { amount, description } = req.body
    let { params } = req.params

    try{

        // check if id
        if(!id || id === null){
            return res.status(400).json({ message: "An error occurred." })
        }

        // check if field is empty 
        if(!amount || amount < 0){
            return res.status(400).json({ message: "Invalid amount." })
        }

        if(!description){
            return res.status(400).json({ message: "Enter description" })
        }

        // get user
        const user = await userModel.findById(id)

        if(!user){
            return res.status(400).json({ message: "User not found" })
        }

        // check if user is active
        if(user.active === false){
            return res.status(400).json({ message: "User account deactivated" })
        }

        // get user available balance
        let balance = user.account_balance

        // add to user account balance 
        balance += amount;

        // update user balance
        const updateBalance = await userModel.findByIdAndUpdate(id, {
            account_balance: balance
        }, { new: true })

        
        if(!updateBalance){
            return res.status(400).json({ message: "Error funding wallet" })
        }

        // push to wallet
        const wallet = new walletModel({
            _by: id,
            amount,
            action: params,
            description
        })

        await wallet.save()

        return res.status(200).json({ message: "Wallet funded successfully", amount, updateBalance, wallet })



    }catch(error){
        return res.status(500).json({ message: error.message })
    }
}

// handle withdrawal 
const handleWithdrawal = async(req, res) => {
    const { id } = req.user
    let { amount, description } = req.body
    let { params } = req.params

    try{

        // check if id
        if(!id || id === null){
            return res.status(400).json({ message: "An error occurred." })
        }

        // check if field is empty 
        if(!amount || amount < 0){
            return res.status(400).json({ message: "Invalid amount." })
        }

        if(!description){
            return res.status(400).json({ message: "Enter description" })
        }

        // get user
        const user = await userModel.findById(id)

        if(!user){
            return res.status(400).json({ message: "User not found" })
        }

        // check if user is active
        if(user.active === false){
            return res.status(400).json({ message: "User account deactivated" })
        }

        // get user available balance
        let balance = user.account_balance

        // add to user account balance 
        balance -= amount;

        // update user balance
        const updateBalance = await userModel.findByIdAndUpdate(id, {
            account_balance: balance
        }, { new: true })

        
        if(!updateBalance){
            return res.status(400).json({ message: "Error withdrawing from wallet" })
        }

        // push to wallet
        const wallet = new walletModel({
            _by: id,
            amount,
            action: params,
            description
        })

        await wallet.save()

        return res.status(200).json({ message: "Withdrawal successful", amount, updateBalance, wallet })



    }catch(error){
        return res.status(500).json({ message: error.message })
    }
}


// export controller

module.exports = {
    handleWallet,
    handleFundWallet,
    handleWithdrawal
}
