const {
    userModel 
} = require("../../model/userSchema")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const {
    verifyAccount,
    resetPass
} = require('../../view/body')

const {
    propertyTransactionModel,
    InstallmentalModel
} = require('../../model/propsTransactionSchema')

const mailer = require("../../utilities/mailer")
const { generateAccountNumber } = require('../../utilities/utils')

const mongoose = require('mongoose')

// registration function 
const handleRegistration = async (req, res) => {
    let { firstname, lastname, email, password, phonenumber } = req.body

    try{
        // change email to lowercase
        email = email.toLowerCase()

        // capitalize firstname and lastname
        firstname = `${firstname.charAt(0).toUpperCase()}${firstname.slice(1).toLowerCase()}`
        lastname = `${lastname.charAt(0).toUpperCase()}${lastname.slice(1).toLowerCase()}`

        // query database
        const existEmail = await userModel.findOne({ email })

        //check if email exists
        if(existEmail){
            return res.status(400).json({ message: "Email already exist" })
        }

        // create user account number 
        generateAccountNumber
        account_number = generateAccountNumber(11)

        const existAccountNum = await userModel.findOne({ account_number })

        if(existAccountNum){
            generateAccountNumber
            account_number = generateAccountNumber(11)
        }

        // hash password
        const hashPassword = await bcrypt.hash(password, 10)
        password = hashPassword


        // create user
        const user = new userModel({
            firstname,
            lastname,
            email,
            password, 
            phonenumber,
            account_number
        })

        // save user to db
        await user.save()

        // create user payload
        const payload = {
            id: user._id,
            email: user.email,
        }

        const token = jwt.sign(payload, process.env.ACCESS_TOKEN, { expiresIn: "30m" })
        // set res cookie
        res.cookie("token", token, { httpOnly: true, maxAge: 3600 })

        // set user link to verify mail 
        const link = `https://propwise.onrender.com/user/verify-account/${token}`

        const subject = 'Verify email account'

        let body = verifyAccount(firstname, link)

        await mailer( email, subject, body )

        return res.status(200).json({ message: "Account created successful, a verification link has been sent to your mail", user, link, token })
    }catch(err){
        return res.status(500).json({ message: err.message })
    }

}

// account verification 
const handleVerification = async (req, res) => {
    const { token } = req.params
    try {
        
        // check token 
        if(!token || token === null){
            return res.status(400).json({ message: "Invalid token props" })
        }

        // verify token 
        const decode = jwt.verify(token, process.env.ACCESS_TOKEN)
        // token id
        const id = decode.id

        // find user by token id 
        const user = await userModel.findById(id)

        if(!user){
            return res.status(400).json({ message: "User not found" })
        }

        if(user.active === false){
            return res.status(400).json({ message: "Account deactivated" })
        }

        if(user.verified === true){
            return res.status(200).json({ message: "Account already verified" })
        }

        const verifyAccount = await userModel.findByIdAndUpdate(
            id,
            {
                verified: true
            },
            {
                new: true
            }
        )

        if(!verifyAccount){
            return res.status(400).json({ message: "Error verifying account" })
        }

        return res.status(200).json({ message: "Congratulations!, account successfully verified" })


    } catch (error) {
        return res.status(500).json({ message: error })
    }
}


const handleLogin = async (req, res) => {
    let { email, password } = req.body
    try {
        

        // convert users email and username to lowercase
        // username = username.toLowerCase()
        // email = email.toLowerCase()

        // find user 
        const user = await userModel.findOne({ email })

        if(!user){
            return res.status(400).json({ message: "User not found." })
        }

        // check if user account is active
        if(user.active !== true){
            return res.status(400).json({ message: "Account deactivated" })
        }

        // check if user account is blocked
        // if(user.account_status !== true){
        //     return res.status(400).json({ message: "Sorry your account has been blocked." })
        // }

        // check if user account is verified
        if(user.verified === false){
            return res.status(400).json({ message: "Account not verified, check your mail and verify your account." })
        }

        // check if user password match
        const isMatched = await bcrypt.compare(password, user.password)

        if(!isMatched){
            return res.status(400).json({ message: "Invalid login credentials" })
        }

        // create user payload
        const payload = {
            id: user._id,
            email: user.email
        }
        // sign payload 
        const token = jwt.sign(payload, process.env.ACCESS_TOKEN, { expiresIn: "30d"})

        // set res cookie
        res.cookie('token', token, { httpOnly: true, maxAge: 3600 })

        return res.status(200).json({ message: "Login successful", token  })

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

const handleUserDetails = async(req, res) =>{
    try{
        const { id } = req.user

        const user = await userModel.findById(id)

        if(!user){
            return res.status(400).json({ message: 'User not found.' })
        }

        if(user.verified === false){
            return res.status(400).json({ message: 'Account not verified.' })
        }

        if(user.active === false){
            return res.status(400).json({ message: 'Account deactivated.' })
        }

        if(user.suspended === true){
            return res.status(400).json({ message: 'Account suspended' })
        }

        if(user.status === true){
            return res.status(400).json({ message: 'Account Blocked.' })
        }

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({ message: 'Entry id is not a valid id type.' })
        }

        // all check passed

        return res.status(200).json({ user })

    }catch(error){
        return res.status(500).json({ message: error.message })
    }
}

const handleEditRecords = async(req, res)=>{
    
    const { firstname, lastname, password, email, phonenumber } = req.body
    const { profile_pics } = req.file
    const { id } = req.user

    try{
        const findUser =  await userModel.findById(id)

        if(!findUser){
            return res.status(400).json({ message: 'User not found' })
        }

        const updateRecords = await userModel.findByIdAndUpdate(
            id,
            {
                firstname,
                lastname,
                password,
                email,
                phonenumber,
                profile_pics
            },
            {
                new: true
            }
        )
        if(!updateRecords){
            return res.status(401).status({ message: 'Error updating records' })
        }

        return res.status(200).json({ message: 'Records updated successfully', updateRecords })

    }catch(error){
        return res.status(500).json({ message: error.message })
    }

    
}

// forget password

const handleForgotPassword = async (req, res) => {
    const { email } = req.body

    try{

        const emailRegExPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

        if(!email){
            return res.status(400).json({ message: 'Please enter your email' })
        }

        if(!emailRegExPattern.test(email)){
            return res.status(400).json({ message: 'Please enter a valid email address' })
        }


        const user = await userModel.findOne({ email })

        if(!user){
            return res.status(200).json({ message: 'No such email found' })
        }

        if(user.verified === false){
            return res.status(400).json({ message: 'Oops! kindly verify your account from your mail.' })
        }

        // if(user.active === false){
        //     return res.status(400).json({ message: 'Sorry account deactivated' })
        // }

        if(user.suspended === true){
            return res.status(400).json({ message: 'user account suspended' })
        }        
        
        if(user.status === true){
            return res.status(400).json({ message: 'user account blocked' })
        }

        // create user payloads

        const payloads = {
            id: user._id,
        }

        // assign a token 

        const token = jwt.sign(payloads, process.env.ACCESS_TOKEN, { expiresIn: '20m' })
        res.cookie("token", token, { httpOnly: true, maxAge: 3600})

        // send mail
        const subject = "Reset Password"

        const resetPassLink = `http://localhost:5000/finance-tracker/api/reset-password/${ token }`

        let body = resetPass(user.firstname, resetPassLink)

        await mailer(email, subject, body)

        return res.status(200).json({ message: 'Password reset link sent to your email.', resetPassLink, token })

    }catch(error){
        return res.status(500).json({ message: error.message })
    }
}

const handleResetPassword = async(req, res) => {

    const { token } = req.params
    const { password } = req.body

    try{

        const decode = jwt.verify(token, process.env.ACCESS_TOKEN)

        const id = decode.id

        if(!decode){
            return res.status(400).json({ message: 'An error occurred' })
        }

        const user = await userModel.findById(id)

        if(!user){
            return res.status(400).json({ message: 'User not found' })
        }

        if(!password){
            return res.status(400).json({ message: 'Please enter your new password' })
        }

        const passRegEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&^])[A-Za-z\d@.#$!%*?&]{8}$/

        if(password.length < 8 || passRegEx.test(password)){
            return res.status(400).json({ message: 'Password should be 8 character long and contain at least 1 number and a sign.' })
        }

        const hashPassword = await bcrypt.hash(password, 10)

        const updatePassword = await userModel.findByIdAndUpdate(id,{
            password: hashPassword
        }, { new: true })

        if(!updatePassword){
            return res.status(400).json({ message: 'Error resetting password' })
        }

        return res.status(200).json({ message: 'Password reset successfully. Now login', user })

    }catch(error){
        res.status(500).body({ message: message.error })
    }
}

// delete account
const handleDeleteAccount = async (req, res) => {
    const { id } = req.user

    try{
        const deleteAcct = await userModel.findByIdAndDelete(id)

        if(!(deleteAcct)) {
           return res.status(401).json({ message: 'Error deleting accounting' })
        }
        return res.status(200).json({ message: 'Account deleted successfully' })
    }catch(error){
        return res.status(500).json({ message: error.message })
    }

}

// deactivate account

const handleDeactivateAcct = async(req, res) => {
    const { id } = req.user

    try{
        const user = await userModel.findOne({ _id: id })

        if(!user){
            return res.status(400).json({ message: 'No user found' })
        }

        const setUser = await userModel.findByIdAndUpdate(
            id,
            {
                active: false
            },
            {
                new: true
            }
        )

        if(!setUser){
           return res.status(400).json({ message: 'Error deactivating account' })
        }

        return res.status(200).json({ message: 'Deactivation successful', setUser})

    }catch(error){
        return res.status(500).json({ message: error.message })
    }
}


// Activate account

const handleReactivateAcct = async (req, res) => {
    const { id } = req.user
    
    try{
        const user = await userModel.findOne({ _id: id })

        if(!user){
            return res.status(400).json({ message: 'No user found' })
        }

        const setUser = await userModel.findByIdAndUpdate(
            id,
            {
                active: true
            },
            {
                new: true
            }
        )

        if(!setUser){
           return res.status(400).json({ message: 'Error reactivating account' })
        }

        return res.status(200).json({ message: 'Account Reactivation successful', setUser})

    }catch(error){
        return res.status(500).json({ message: error.message })
    }

}

const handleLogout = async(req, res) => {
    res.clearCookie('token')

    return res.status(200).json({ message: 'Successfully logged out.'})
}

// get all full payment property transactions
const handleAllPropsTransaction = async(req, res)=>{
    try{
        const { id } = req.user

        const user = await userModel.findById(id)

        if(!user){
            return res.status(400).json({ message: "No user found." })
        }

        // query property transactions
        const propsTransaction = await propertyTransactionModel.find().sort({ createdAt: -1 }).populate('property_id')

        if(!propsTransaction){
            return res.status(400).json({ message: 'Error fetching transactions.' })
        }

        if(!propsTransaction.length > 0){
            return res.status(400).json({ message: 'No full payment transaction initiated yet.' })
        }

        return res.status(200).json({ message: 'Query successful', count: propsTransaction.length, propsTransaction })

    }catch(error){
        return res.status(500).json({ message: error.message })
    }
}

// all installmental transaction 
const handleInstallmentalTransaction = async(req, res)=>{
    try{
        const { id } = req.user

        const user = await userModel.findById(id)

        if(!user){
            return res.status(400).json({ message: "No admin found." })
        }

        // query property transactions
        const installmentalTransaction = await InstallmentalModel.find().sort({ createdAt: -1 })
        .populate([{ path: 'property', select:['title']}, { path: '_by', select: ['firstname']}])

        if(!installmentalTransaction){
            return res.status(400).json({ message: 'Error fetching transactions.' })
        }

        if(!installmentalTransaction.length > 0){
            return res.status(400).json({ message: 'No installmental payment initiated yet.' })
        }

        return res.status(200).json({ message: 'Query successful', count: installmentalTransaction.length, installmentalTransaction })

    }catch(error){
        return res.status(500).json({ message: error.message })
    }
}

module.exports = {
    handleRegistration,
    handleVerification,
    handleLogin,
    handleUserDetails, 
    handleEditRecords,
    handleDeleteAccount,
    handleForgotPassword,
    handleResetPassword,
    handleDeactivateAcct,
    handleReactivateAcct,
    handleLogout,
    handleAllPropsTransaction,
    handleInstallmentalTransaction
}