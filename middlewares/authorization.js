const jwt = require ("jsonwebtoken");
const {
    userModel
} = require("../model/userSchema")
const {
    adminModel
} = require("../model/adminSchema")
const Authorization = async (req, res, next) => {
    try{
        const Header = req.header("Authorization")
        const splitHeader = Header.split(" ")

        const token = splitHeader[1]

        if(!token || token === null){
           return res.status(400).json({ message: "An error occurred" })
        }
        // verify token 
        const verifyToken = jwt.verify(token, process.env.ACCESS_TOKEN)

        if(!verifyToken){
            return res.status(400).json({ message: "Access denied"})
        }

        const user = await userModel.findById({ _id: verifyToken.id })

        if(!user){
           return res.status(400).json({ message: "User not found" })
        }

        // if(user.active === false){
        //     return res.status(400).json({ message: 'user account deactivated' })
        // }

        if(user.suspended === true){
            return res.status(400).json({ message: 'user account suspended. Contact the admin.' })
        }

        if(user.status === true){
            return res.status(400).json({ message: 'user account blocked' })
        }

        req.user = user

        next()

    }catch(error){
        return res.status(401).json({ message: 'Only logged in user can access this page.' })
    }
}


const adminAuth = async(req, res, next) => {
    try{
        const header = req.header('Authorization')
        const splitHeader = header.split(" ")
        const token = splitHeader[1]

        if(!token || token === null){
            return res.status(400).json({ message: 'An error occurred.' })
        }

        const signature = jwt.verify(token, process.env.ACCESS_TOKEN)

        if(!signature){
            return res.status(400).json({ message: 'Unauthorized access.' })
        }

        const admin = await adminModel.findById({ _id: signature.id})

        if(!admin){
            return res.status(400).json({ message: "Admin not found" })
        }

        if(admin.role !== "admin" ){
            return res.status(400).json({ message: "Access denied." })
        }

        req.admin = admin

        next()

    }catch(error){
        return res.status(500).json({ message: 'Only logged in admin can access this page.' })
    }
}

module.exports = {
    Authorization,
    adminAuth
}