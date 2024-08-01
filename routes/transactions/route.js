const {
    getAllUsersTransaction,
    cancelPurchase
} = require("../../controllers/transactions/propsTransactions")

const {
    Authorization
} = require("../../middlewares/authorization")


const express = require('express')

const Router = express.Router()

Router.get("/props-transaction", Authorization, getAllUsersTransaction)

Router.delete("/cancel/:props_id", Authorization, cancelPurchase)

module.exports = Router