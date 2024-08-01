const mongoose = require("mongoose")
require ("dotenv").config()


const connect = async () => {
    try{
       await mongoose.connect(`${process.env.MONGO_URL}`)
        .then(()=>{
            console.log(`database connected successfully`)
        })
    }catch(error){
        console.log(error)
    }
}

module.exports = connect