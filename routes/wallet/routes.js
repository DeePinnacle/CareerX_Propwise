const express = require('express')
const { Authorization } = require('../../middlewares/authorization')
const {
    handleWallet,
    handleFundWallet,
    handleWithdrawal
} = require('../../controllers/wallet/walletCtrl')

const Router = express.Router()

Router.get("/", Authorization, handleWallet)

Router.patch("/fund", Authorization, handleFundWallet)

Router.patch("/withdraw", Authorization, handleWithdrawal)

module.exports = Router