const nodemailer = require('nodemailer')
const path = require('path')
const fs = require('fs')

require ('dotenv').config()



const PASSWORD = process.env.PASSWORD
const EMAIL = process.env.EMAIL
const SENDER_MAIL = process.env.SENDER_MAIL


const mailer = async (email, subject, body) => {

    try{
        // let logoPath = path.join(__dirname, 'public', 'img', 'Logo.png')

        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: EMAIL,
                pass: PASSWORD
            }
        })
    
        let mailerInfo = {
            from: SENDER_MAIL,
            to: email,
            subject: subject,
            html: body
            // attachments: [
            //     {
            //         filename: 'Logo.png',
            //         path: logoPath,
            //         cid: 'logoImage'
            //     }
            // ]
        }

        await transporter.sendMail(mailerInfo)

    }catch(err){
        throw Error (err.message)
    }
}


module.exports = mailer