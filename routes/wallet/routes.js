const express = require('express')
const { Authorization } = require('../../middlewares/authorization')
const {
    handleWallet,
    handleWalletAction
} = require('../../controllers/wallet/walletCtrl')

const Router = express.Router()

Router.get("/wallet", Authorization, handleWallet)

Router.patch("/wallet/:params", Authorization, handleWalletAction)

module.exports = Router