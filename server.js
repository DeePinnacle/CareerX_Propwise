const express = require ("express")
const cors = require("cors")
const HomeRouter = require("./routes/home/routes")
const UserRouter = require("./routes/user/routes")
const adminRouter = require("./routes/admin/routes")
const propRouter = require('./routes/property/routes')
const walletRouter = require('./routes/wallet/routes')
const connect = require("./config/db")
require ("dotenv").config()
const cookieParser = require('cookie-parser')

const app = express()

const PORT = process.env.PORT || 8000

// register middlewares
app.use(cookieParser())
app.use(cors({
    origin: ["http://localhost:5173"],
    credentials: true
}))

app.use(express.json())

app.use((req, res, next)=>{
    console.log(req.method, req.path)
    next()
})
app.use("/uploads", express.static("public/uploads"))
app.use("/profile/uploads", express.static("profile/uploads"))

 connect()

app.listen(process.env.PORT, ()=>{
    console.log(`server running and listening to ${ PORT }`)
})

// home page
app.use("/", HomeRouter)

// APIs
app.use("/user", UserRouter)
app.use("/admin", adminRouter)
app.use("/", propRouter)
app.use("/wallet", walletRouter)
