const express = require('express')
const {
    handleGetAllProps,
    handlePropsDetails,
    handleByState,
    handleByCity,
    handleByPrice,
    handleBuyProps
} = require('../../controllers/property/propertyCtrl')
const {
    Authorization
} = require('../../middlewares/authorization')



const Router = express.Router()

Router.get("/properties", handleGetAllProps)

Router.get("/details/:id", handlePropsDetails)

Router.get("/search/state/:state", handleByState)

Router.get("/search/city/:city", handleByCity)

Router.get("/search/price/:price", handleByPrice)

Router.post("/buy/:payment_choice/:propsID", Authorization, handleBuyProps)




module.exports = Router