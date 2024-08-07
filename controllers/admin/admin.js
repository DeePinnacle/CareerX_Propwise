const {
    userModel 
} = require ('../../model/userSchema')
const {
    adminModel 
} = require ('../../model/adminSchema')

const {
    propsModel
} = require("../../model/propertySchema")
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { default: mongoose } = require('mongoose')
const {
    propertyTransactionModel,
    InstallmentalModel
} = require("../../model/propsTransactionSchema")

const {
    walletModel
} = require("../../model/walletSchema")

const adminDashboard = async(req, res)=>{
    try {
        const { id } = req.admin
        const admin = await adminModel.findById(id)
        
        if(!admin){
            return res.status(400).json({ message: "No admin found." })
        }
        // query database
        const user = await userModel.find()
        const properties = await propsModel.find()
        const propsTransaction = await propertyTransactionModel.find()
        const installmentalTransaction = await InstallmentalModel.find()

        // total purchase approved
        const approvedProps = await propertyTransactionModel.find({ status: "approved" })

        // total cancelled
        const cancelledProps = await propertyTransactionModel.find({ status: "cancelled" })

        // total pending transactions

        const pendingRequest = await propertyTransactionModel.find({ status: "pending" })

        if(admin.account_balance < 0){
            // set account to 0
            const setAccountToZero = await adminModel.findByIdAndUpdate(id,{
                account_balance: 0
            }, { new: true })
            return setAccountToZero
        }

        const dashboard = {
            RegisteredUsers: user.length,
            account_balance: admin.account_balance,
            TotalPropsPosted: properties.length,
            propsTransaction: propsTransaction.length,
            installmentalTransaction: installmentalTransaction.length,
            approvedProps: approvedProps.length,
            cancelledProps: cancelledProps.length,
            pendingRequest: pendingRequest.length
        }
        return res.status(200).json({ message: "Dashboard queried successfully", dashboard, admin })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

const handleRegisterAdmin = async(req, res)=>{
    try{
        let { username, email, password } = req.body


        // check if user is submitting an empty field

        if(!username){
            return res.status(400).json({ message: "Enter your username" })
        }
        if(!email){
            return res.status(400).json({ message: "Enter your email" })
        }
        if(!validator.isEmail(email)){
            return res.status(400).json({ message: 'Enter a valid email' })
        }

        if(!password){
            return res.status(400).json({ message: "Enter your password" })
        }

        if(!validator.isStrongPassword(password)){

            return res.status(400).json({ message: 'Password should contain at least, 1 number, an uppercase, lowercase and a sign.' })
        }

        // check if email or username already exist
        const emailExist = await adminModel.findOne({ email })
        const usernameExist = await adminModel.findOne({ username })

        if(emailExist){
            return res.status(400).json({ message: 'email already in use.' })
        }
        if (usernameExist) {
            return res.status(400).json({ message: 'username already in use.' })
        }

        password = await bcrypt.hash(password, 10)

        // convert entries to lowercase
        username = username.toLowerCase();
        email = email.toLowerCase();
        
        const admin = new adminModel({
            username,
            password, 
            email
        })

        await admin.save()

        // create admin payload
        const payloads = {
            id: admin._id,
            email: admin.email,
            role: admin.role
        }

        // create admin token 

        const token = jwt.sign(payloads, process.env.ACCESS_TOKEN, { expiresIn: "5d" })

        // save token
        res.cookie("token", token, { httpOnly: true, maxAge: 3600 })

        // set verification link
        // const link = `http://localhost:5000/propwise/api/admin/propadmin-reg/${ token }`

        // const subject = "Verify your email account"

        // const body = verifyAccount(link)

        // await mailer(email, subject, body)

        return res.status(200).json({ message: 'Admin created successfully', token, admin })

    }catch(error){
        return res.status(500).json({ message: error.message })
    }
}

// handle verify admin email account

// handle admin login
const handleAdminLogin = async(req, res)=>{
    try{
        const  { username, password } = req.body

        if(!username){
            return res.status(400).json({ message: 'Enter your username' })
        }
        if(!password){
            return res.status(400).json({ message: "Enter your password" })
        }
        const admin = await adminModel.findOne({ username })

        if(!admin){
            return res.status(400).json({ message: 'Admin not found.' })
        }
        const comparePassword = await bcrypt.compare(password, admin.password)

        if(!comparePassword){
            return res.status(400).json({ message: 'Invalid username/password' })
        }

        // create payloads
        const payloads = {
            id: admin._id,
            username: admin.username,
            role: admin.role
        }

        // create token 
        const token = jwt.sign(payloads, process.env.ACCESS_TOKEN, { expiresIn: '5d' })
        res.cookie('token', token, { httpOnly: true, maxAge: 3600 })

        return res.status(200).json({ message: 'Login successful', token })

    }catch(err){
        res.status(400).json({ message: err.message })
    }
}

// create property listing
const handleAddProperty = async(req, res) =>{
    try{
      let { 
            brokered_by, 
            title, 
            description, 
            price, 
            acre_lot, 
            state, 
            city, 
            prop_status, 
            prop_type,
            features,
            bedrooms,
            bathrooms,
            year_built
        } = req.body
        const { id } = req.admin

        let { images } = req.files;
        
        if (req.files) {
            let filename = "";
      
            for (let image of images) {
              filename += `${image.filename} ${","}`;
            }
            filename = filename.substring(0, filename.lastIndexOf(","));
            images = filename;
            console.log(images);
            
          }else {
            return res.status(400).json({ message: "No image file selected" })
          }
          console.log(images)

        if(!id){
            return res.status(400).json({ message: 'Access denied' })
        }
        const property = new propsModel({
            brokered_by: id,
            title,
            description,
            price,
            acre_lot,
            state,
            city,
            images,
            prop_status,
            prop_type,
            features,
            bedrooms,
            bathrooms,
            year_built
        })

        if(!property){
            return res.status(400).json({ message: "An error occurred adding new property." })
        }

        // convert user entries to capitalize
        title = `${title.charAt(0).toUpperCase()}${title.slice(1).toLowerCase()}`
        state = `${state.charAt(0).toUpperCase()}${title.slice(1).toLowerCase()}`

        await property.save()

        return res.status(200).json({ message: "Property created successfully.", property })

    }catch(error){
        return res.status(500).json({ message: error.message })
    }
}

// edit property
const handlePropertyEdit = async(req, res) =>{
    try {
        const { id } = req.admin
        const { props_id } = req.params
        const {
            title, 
            description, 
            price, 
            acre_lot, 
            state, 
            city, 
            prop_status, 
            prop_type,
            features,
            image,
            images,
            bedrooms,
            bathrooms,
            year_built
        } = req.body

        if(!id){
            return res.status(400).json({ message: "An error occurred." })
        }

        const propsIdExist = await propsModel.findById(props_id)

        if(!propsIdExist){
            return res.status(400).json({ message: "Property ID does not exist." })
        }

        if(!mongoose.Types.ObjectId.isValid(props_id)){
            return res.status(400).json({ message: "Not a valid ID address." })
        }

        const editProps = await propsModel.findByIdAndUpdate({ _id: props_id}, {
            title, 
            description, 
            price, 
            acre_lot, 
            state, 
            city, 
            prop_status, 
            prop_type,
            features,
            image,
            images,
            bedrooms,
            bathrooms,
            year_built
        }, { new: true })

        if(!editProps){
            return res.status(400).json({ message: "Error editing property." })
        }

        return res.status(200).json({ message: "Property successfully edited.", editProps })

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

// get all properties
const handleGetAllProps = async(req, res) => {
    try{
        const { id } = req.admin

        const admin = await adminModel.findById(id)

        if(!admin){
            return res.status(400).json({ message: "No admin found." })
        }

        const properties = await propsModel.find()

        if(!properties.length > 0){
            return res.status(400).json({ message: 'No property listing yet.' })
        }

        return res.status(200).json({ message: "loaded properties successfully", properties })

    }catch(error){
        return res.status(400).json({ message: error.message })
    }
}

// get all full payment property transactions
const handleAllPropsTransaction = async(req, res)=>{
    try{
        const { id } = req.admin

        const admin = await adminModel.findById(id)

        if(!admin){
            return res.status(400).json({ message: "No admin found." })
        }

        // query property transactions
        const propsTransaction = await propertyTransactionModel.find().sort({ createdAt: -1 }).populate('property_id')

        if(!propsTransaction){
            return res.status(400).json({ message: 'Error fetching transactions.' })
        }

        if(!propsTransaction.length > 0){
            return res.status(400).json({ message: 'No user has initiated any property transaction.' })
        }

        return res.status(200).json({ message: 'Query successful', count: propsTransaction.length, propsTransaction })

    }catch(error){
        return res.status(500).json({ message: error.message })
    }
}

// all installmental transaction 
const handleInstallmentalTransaction = async(req, res)=>{
    try{
        const { id } = req.admin

        const admin = await adminModel.findById(id)

        if(!admin){
            return res.status(400).json({ message: "No admin found." })
        }

        // query property transactions
        const installmentalTransaction = await InstallmentalModel.find().sort({ createdAt: -1 })
        .populate([{ path: 'property', select:['title']}, { path: '_by', select: ['firstname']}])

        if(!installmentalTransaction){
            return res.status(400).json({ message: 'Error fetching transactions.' })
        }

        if(!installmentalTransaction.length > 0){
            return res.status(400).json({ message: 'No user has initiated any installmental transaction.' })
        }

        return res.status(200).json({ message: 'Query successful', count: installmentalTransaction.length, installmentalTransaction })

    }catch(error){
        return res.status(500).json({ message: error.message })
    }
}

// get all users
const handleGetAllUsers = async(req, res) =>{
    try{
        const registeredUsers = await userModel.find()

        // check if no user
        if(!registeredUsers){
            return res.status(400).json({ message: "No registered users" })
        }

        if(!registeredUsers.length > 0){
            return res.status(400).json({ message: "No registered users" })
        }

        return res.status(200).json({message: "Query successful", RegisteredUsers: registeredUsers.length, registeredUsers })

    }catch(errors){
        return res.status(500).json({ message: errors.message })
    }
}

// delete all users

const handleDeleteAllUsers = async(req, res) => {
    try{

        const deleteAll = await userModel.deleteMany()

        if(!deleteAll){
            return res.status(400).json({ message: "Error deleting all users" })
        }

        return res.status(200).json({ message: "Successfully deleted all users" })

    }catch(errors){
        return res.status(500).json({ message: errors })
    }
}

// delete single user
const handleDeleteSingleUser = async(req, res) =>{
    try{
        const { id } = req.admin
        const { userID } = req.params

        const admin = await adminModel.findById(id)
        const user = await userModel.findById(userID)
        
        if(!admin){
            return res.status(400).json({ message: 'No admin found' })
        }

        if(!user){
            return res.status(400).json({ message: 'No user found' })
        }

        if(!mongoose.Types.ObjectId.isValid(userID)){
            return res.status(400).json({ message: "Not a valid id address" })
        }

        const deleteSingleUser = await userModel.findByIdAndDelete({ _id: userID })

        if(!deleteSingleUser){
            return res.status(400).json({ message: "Error deleting single user." })
        }

        return res.status(200).json({ message: `User with id: ${ userID } successfully deleted.` })

        
    }catch(err){
        return res.status(400).json({ message: err.message })
    }
}

// handle delete a single property 
const handleDeleteSingleProps = async(req, res) =>{
    try {
        const { id } = req.admin
        const { props_id } = req.params

        if(!id){
            return res.status(400).json({ message: "An error occurred" })
        }

        if(!mongoose.Types.ObjectId.isValid(props_id)){
            return res.status(400).json({ message: "Not a valid id address" })
        }

        const deleteSingleProps = await propsModel.findByIdAndDelete({ _id: props_id })

        if(!deleteSingleProps){
            return res.status(400).json({ message: "Error deleting single props." })
        }

        return res.status(200).json({ message: `Property with id: ${ props_id } successfully deleted.` })


    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

// handle delete all props
const handleDeleteAllProps = async(req, res)=>{
    try {
        const { id } = req.admin

        const admin = await adminModel.findById(id)

        if(!admin){
            return res.status(400).json({ message: 'No admin found.' })
        }

        const deleteAllProps = await propsModel.deleteMany()

        if(!deleteAllProps){
            return res.status(400).json({ message: "Error deleting all property" })
        }
        return res.status(200).json({ message: "All properties successfully deleted." })
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

// handle Wallet transactions
const handleAllWalletTransaction = async(req, res)=>{
    try{
        const { id } = req.admin

        const admin = await adminModel.findById(id)

        if(!admin){
            return res.status(400).json({ message: "No admin found." })
        }

        // query property transactions
        const walletTransaction = await walletModel.find()

        if(!walletTransaction){
            return res.status(400).json({ message: 'Error fetching wallet transactions.' })
        }

        if(!walletTransaction.length > 0){
            return res.status(400).json({ message: "No wallet transaction initiated yet," })
        }

        if(!walletTransaction.length > 0){
            return res.status(400).json({ message: 'No user has initiated any wallet transaction.' })
        }

        return res.status(200).json({ message: 'Query successful', count: walletTransaction.length, walletTransaction })

    }catch(error){
        return res.status(500).json({ message: error.message })
    }
} 

// delete all transaction 

const handleDeleteAllWalletTransaction = async(req, res) =>{
    try{
        const { id } = req.admin

        const admin = await adminModel.findById(id)

        if(!admin){
            return res.status(400).json({ message: "No admin found." })
        }

        const deleteAllTransaction = await walletModel.deleteMany()

        if(!deleteAllTransaction){
            return res.status(400).json({ message: "Error deleting transactions" })
        }

        return res.status(200).json({ message: "Wallet transactions successfully deleted." })

    }catch(err){
        return res.status(500).json({ message: err.message })
    }
}

// delete a single transaction 
const handleDeleteSingleWalletTransaction = async(req, res)=>{
    try{
        const { id } = req.admin
        const admin = await adminModel.findById(id)
        const { walletID } = req.params

        if(!admin){
            return res.status(400).json({ message: "No admin found." })
        }

        if(!walletID){
            return res.status(400).json({ message: "No wallet ID found" })
        }

        if(!mongoose.Types.ObjectId.isValid(walletID)){
            return res.status(400).json({ message: "Not a valid ID" })
        }

        const deleteTransaction = await walletModel.findByIdAndDelete(walletID)

        if(!deleteTransaction){
            return res.status(400).json({ message: "Error deleting transaction" })
        }

        return res.status(200).json({ message: `Wallet with ${ walletID } has been deleted.` })

    }catch(err){
        return res.status(500).json({ message: err.message })
    }
}

// handle delete all property transaction 
const handleDeleteAllPropsTransaction = async(req, res) =>{
    try {
        const { id } = req.admin

        const admin = await adminModel.findById(id)

        if(!admin){
            return res.status(400).json({ message: "Admin not found." })
        }

        const deleteAllPropsTransaction = await propertyTransactionModel.deleteMany()

        if(!deleteAllPropsTransaction){
            return res.status(400).json({ message: "Error deleting props transactions" })
        }

        return res.status(200).json({ message: "Props transactions deleted succesfuly" })

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

// cancel purchase
const handleCancelPurchase = async(req, res)=>{
    try {
        const { id } = req.admin
        const { props_id } = req.params
        // check user 
        const admin = await adminModel.findById(id)
        if(!admin){
            return res.status(400).json({ message: "admin not found." })
        }
        // check props
        const props = await propertyTransactionModel.findOne({ _id: props_id })
        if(!props){
            return res.status(400).json({ message: "Property with id not found" })
        }

        // get user wallet balance

        const user_id = props.purchased_by
        const user = await userModel.findById(user_id)

        let wallet = user.account_balance
        let props_amount = props.amount
        wallet = Number(wallet) + Number(props_amount)

        // // update user wallet balance 
        const updateUserBalance = await userModel.findByIdAndUpdate(user_id,{
            account_balance: wallet
        }, { new: true })

        // update property status
        const purchase_id = props.property_id
        const propStatus = await propsModel.findByIdAndUpdate(purchase_id, {
            prop_status: "available"
        }, { new: true })

        if(!updateUserBalance){
            return res.status(400).json({ message: "Error updating status." })
        }

        if(!propStatus){
            return res.status(400).json({ message: "Error updating property status." })
        }
        // update property from user transaction 
        const updatePropsStatus = await propertyTransactionModel.findByIdAndUpdate(props_id,{
            status: "cancelled"
        }, { new: true })

        if(!updatePropsStatus){
            return res.status(400).json({ message: "Error cancelling property purchase." })
        }

        return res.status(200).json({ message: "Purchase not approved.", props, wallet })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

// approve purchase
const handleApprovePurchase = async(req, res)=>{
    try {
        const { id } = req.admin
        const { transactionID } = req.params
        // check user 
        const admin = await adminModel.findById(id)
        if(!admin){
            return res.status(400).json({ message: "admin not found." })
        }
        // check props
        const props = await propertyTransactionModel.findOne({ _id: transactionID })
        if(!props){
            return res.status(400).json({ message: "Transaction with id not found" })
        }

        // update admin wallet

        // const user_id = props.purchased_by
        // const user = await userModel.findById(user_id)

        // let wallet = user.account_balance
        // let props_amount = props.amount
        // wallet = Number(wallet) + Number(props_amount)

        // // // update user wallet balance 
        // const updateUserBalance = await userModel.findByIdAndUpdate(user_id,{
        //     account_balance: wallet
        // }, { new: true })

        // update property status
        const purchase_id = props.property_id
        const propStatus = await propsModel.findByIdAndUpdate(purchase_id, {
            prop_status: "sold"
        }, { new: true })

        // if(!updateUserBalance){
        //     return res.status(400).json({ message: "Error updating status." })
        // }

        if(!propStatus){
            return res.status(400).json({ message: "Error updating property status." })
        }
        // update property from user transaction 
        const updatePropsStatus = await propertyTransactionModel.findByIdAndUpdate(transactionID,{
            status: "approved"
        }, { new: true })

        if(!updatePropsStatus){
            return res.status(400).json({ message: "Error approving property purchase." })
        }

        return res.status(200).json({ message: "Purchase approved." })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

const handleTotalFullPayment = async(req, res)=>{
    try {
        const { id } = req.admin
        const admin = await adminModel.findById(id)

        if(!admin){
            return res.status(400).json({ message: "Admin not found." })
        }


        // query full payment and perform calculation 
        const fullPayment = await propertyTransactionModel.find()

        if(!fullPayment){
            return res.status(400).json({ message: "An error occured." })
        }

        if(fullPayment.length < 0){
            return res.status(400).json({ message: "No transaction yet." })
        }

        let totlaPayment = fullPayment.reduce((current, payment)=>{
            return total = Number(current) + Number(payment.amount)
        },0)

        return res.status(200).json({ message: "Total Amount of Full Payment made", totlaPayment })

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

const handleTotalInstallmental = async(req, res)=>{
    try {
        const { id } = req.admin
        const admin = await adminModel.findById(id)

        if(!admin){
            return res.status(400).json({ message: "Admin not found." })
        }


        // query full payment and perform calculation 
        const installmentalPayment = await InstallmentalModel.find()

        if(!installmentalPayment){
            return res.status(400).json({ message: "An error occured." })
        }

        if(installmentalPayment.length < 0){
            return res.status(400).json({ message: "No transaction yet." })
        }

        let totlaPayment = installmentalPayment.reduce((current, payment)=>{
            return total = Number(current) + Number(payment.down_payment)
        },0)

        return res.status(200).json({ message: "Total Amount of Full Payment made", totlaPayment })

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}


const adminAcct = async(req, res) => {
    try {
        const { id } = req.admin
        const update = await adminModel.findByIdAndUpdate(id,{
            account_balance: 0
        }, { new: true })
        return res.status(200).json({ message: "success" })
    } catch (error) {
        return res.status(500).json({ message : error.message})
    }
}


module.exports = {
    handleGetAllUsers,
    handleDeleteAllUsers,
    handleDeleteSingleUser,
    handleRegisterAdmin,
    handleAddProperty,
    handleAdminLogin,
    handleGetAllProps,
    handleDeleteAllProps,
    handlePropertyEdit,
    handleDeleteSingleProps,
    handleAllPropsTransaction,
    handleAllWalletTransaction,
    handleDeleteAllWalletTransaction,
    handleDeleteSingleWalletTransaction,
    handleDeleteAllPropsTransaction,
    handleCancelPurchase,
    handleApprovePurchase,
    adminDashboard,
    handleInstallmentalTransaction,
    adminAcct,
    handleTotalFullPayment,
    handleTotalInstallmental
}