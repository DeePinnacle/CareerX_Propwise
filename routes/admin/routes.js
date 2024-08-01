const express = require ("express")

const {
    handleGetAllUsers,
    handleDeleteAllUsers,
    handleRegisterAdmin,
    handleAdminLogin,
    handleAddProperty,
    handleGetAllProps,
    handleDeleteAllProps,
    handlePropertyEdit,
    handleDeleteSingleProps,
    handleAllPropsTransaction,
    handleDeleteSingleUser,
    handleAllWalletTransaction,
    handleDeleteSingleWalletTransaction,
    handleDeleteAllWalletTransaction,
    handleDeleteAllPropsTransaction,
    handleCancelPurchase,
    handleApprovePurchase,
    adminDashboard
} = require('../../controllers/admin/admin')
const {
    propsAuth
} = require("../../middlewares/authentication")
const {adminAuth} = require('../../middlewares/authorization')
const Router = express.Router()

Router.get("/admin/dashboard", adminAuth, adminDashboard)

Router.post("/propwise-admin/reg", handleRegisterAdmin)

Router.post("/propwise-admin/login", handleAdminLogin)

Router.post("/create-property", adminAuth, propsAuth, handleAddProperty)

Router.get("/properties", adminAuth, handleGetAllProps)

Router.get("/property/transactions", adminAuth, handleAllPropsTransaction)

Router.get("/users", adminAuth, handleGetAllUsers)

Router.get("/wallet/transactions", adminAuth, handleAllWalletTransaction)

Router.patch("/edit-property/:props_id", adminAuth, handlePropertyEdit)

Router.delete("/users/delete-all", adminAuth, handleDeleteAllUsers)

Router.delete("/users/delete/:userID", adminAuth, handleDeleteSingleUser)

Router.delete("/properties/delete-all", adminAuth, handleDeleteAllProps)

Router.delete("/properties/delete/:props_id", adminAuth, handleDeleteSingleProps)

Router.delete("/wallet/delete-all", adminAuth, handleDeleteAllWalletTransaction)

Router.delete("/wallet/delete/:walletID", adminAuth, handleDeleteSingleWalletTransaction)

Router.delete("/delete/props/transactions", adminAuth, handleDeleteAllPropsTransaction)

Router.patch("/transactions/cancel/:props_id", adminAuth, handleCancelPurchase)

Router.patch("/transactions/approved/:transactionID", adminAuth, handleApprovePurchase)

module.exports = Router