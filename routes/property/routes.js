const express = require('express')
const {
    handleGetAllProps,
    handlePropsDetails,
    handleByState,
    handleByCity,
    handleByPrice,
    handleBuyProps,
    handleInstallmentalPurchase,
    getAllUsersTransaction,
    cancelPurchase,
    handleAllTransactions,
    deleteSingleTransactionHistory,
    handleCancelInstallmentalPay
} = require('../../controllers/property/propertyCtrl')
const {
    Authorization
} = require('../../middlewares/authorization')



const Router = express.Router()

Router.get("/properties", handleGetAllProps)

Router.get("/property/details/:id", handlePropsDetails)

Router.get("/property/search/state/:state", handleByState)

Router.get("/property/search/city/:city", handleByCity)

Router.get("/property/search/price/:price", handleByPrice)

Router.post("/property/buy/full-payment/:propsID", Authorization, handleBuyProps)

Router.post('/property/buy/installmental/:propsID', Authorization, handleInstallmentalPurchase)

Router.delete("/property/cancel/:props_id", Authorization, cancelPurchase)

Router.delete("/property/installmental-purchase/cancel/:props_id", Authorization, handleCancelInstallmentalPay)

Router.get('/properties/transactions', Authorization, handleAllTransactions)

Router.delete('/transaction/history/delete/:transaction_id', Authorization, deleteSingleTransactionHistory)




module.exports = Router