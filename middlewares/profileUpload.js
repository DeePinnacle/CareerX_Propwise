const multer = require ("multer")
const { v4: uuidv4 } = require ("uuid")
const path = require ("path")

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "./profile/uploads")
    },
    filename: function(req, file, cb){
        cb(null, `${uuidv4()}_${path.extname(file.originalname)}`)
    }
})

const allowedFiles = (req, file, cb) => {
    const filesSupported = ["image/jpeg", "image/jpg", "image/png"]
    
    if(filesSupported.includes(file.mimetype)){
        cb(null, true)
    }else{
        cb(null, false)
    }
}

const uploadMulter = multer({
    storage,
    allowedFiles
})

module.exports = uploadMulter;