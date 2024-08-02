const express = require ("express")
const cors = require("cors")
const UserRouter = require("./routes/user/routes")
const adminRouter = require("./routes/admin/routes")
const propRouter = require('./routes/property/routes')
const walletRouter = require('./routes/wallet/routes')
const transactionRouter = require("./routes/transactions/route")
const connect = require("./config/db")
require ("dotenv").config()

const app = express()

const PORT = process.env.PORT || 8000

// register middlewares
app.use(cors())

app.use(express.json())

app.use((req, res, next)=>{
    console.log(req.method, req.path)
    next()
})

 connect()

app.listen(process.env.PORT, ()=>{
    console.log(`server running and listening to ${ PORT }`)
})

// home page
app.get ("/", (req, res)=>{
    return res.status({ message: "Welcome to propwise API", 
        APIs: { 
            userAPI: "/propwise/user/api", 
            AdminAPI: "/propwise/admin/api",
            propetyAPI: "/propwise/property/api",
            walletAPI: "/propwise/wallet/api",
            transactionAPI: "propwise/transactions/api"
        } })
})

app.use("/propwise/user/api", UserRouter)
app.use("/propwise/admin/api", adminRouter)
app.use("/propwise/property/api", propRouter)
app.use("/propwise/wallet/api", walletRouter)
app.use("/propwise/transactions/api", transactionRouter)