const validator = require("validator")
const regAuthentication = (req, res, next) => {
    try {
        const errors = []
        const { firstname, lastname, password, email, phonenumber } = req.body

        if(!firstname){
            errors.push("please enter your firstname")
        }else if(!lastname){
            errors.push("please enter your last name")
        }
        else if(!password){
            errors.push("please enter your password")
        }else if(!validator.isStrongPassword(password)){
            errors.push("enter a strong password containing at least 8 character long, lowercase, uppercase and a number")
        }
        else if(!email){
            errors.push("please enter your email")
        }else if(!validator.isEmail(email)){
            errors.push("please enter a valid email address")
        }
        else if(!phonenumber){
            errors.push("please enter your phone number")
        }

        if(errors.length > 0 ){
            return res.status(400).json({ message: errors })
        }

    } catch (error) {
        return res.status(400).json({ message: error })
    }
    next()
}

const loginAuthentication  = (req, res, next) => {
    try {
        const { email, password } = req.body
        const errors = []

        // check if fields is empty
        if(!email){
            errors.push("please enter your email")
        }else if(!password){
            errors.push("please enter password")
        }

        if(errors.length > 0){
            return res.status(400).json({ message: errors })
        }

    } catch (error) {
        return res.status(500).json({ message: error })
    }
    next()
}

const propsAuth = (req, res, next)=>{
    try{
        const { 
            title, 
            description, 
            price, 
            acre_lot, 
            state, 
            city, 
            prop_type,
            features,
            bedrooms,
            bathrooms,
            year_built
        } = req.body

        const errors = []
        
        if(!title){
            errors.push('Enter property title')
        }
        if(!description){
            errors.push('Enter property description')
        }
        if(!price){
            errors.push('Enter property price')
        }
        if(!acre_lot){
            errors.push('Enter acre lot')
        }
        if(!state){
            errors.push('Enter property state')
        }
        if(!city){
            errors.push('Enter property city')
        }
        if(!prop_type){
            errors.push('Enter property type')
        }
        if(!features){
            errors.push('Provide property features')
        }
        if(!bedrooms){
            errors.push('Enter the number of bedrooms')
        }
        if(!bathrooms){
            errors.push('Enter number of bathrooms')
        }
        if(!year_built){
            errors.push('Enter year built')
        }
    
        if(errors.length > 0){
            return res.status(400).json({ message: errors })
        }
        next()
    }catch(err){
        return res.status(500).json({ message: err.message })
    }
}


module.exports = {
    regAuthentication,
    loginAuthentication,
    propsAuth
}