const express = require("express")
const { 
    handleRegistration,
    handleVerification,
    handleLogin,
    handleEditRecords,
    handleForgotPassword,
    handleResetPassword,
    handleDeactivateAcct,
    handleReactivateAcct,
    handleDeleteAccount,
    handleUserDetails,
    handleLogout,
    handleAllPropsTransaction,
    handleInstallmentalTransaction
 } = require("../../controllers/user/users")
const { 
    regAuthentication,
    loginAuthentication
 } = require("../../middlewares/authentication")
const { Authorization } = require("../../middlewares/authorization")

const profileUpload = require('../../middlewares/profileUpload')

const Router = express.Router()

Router.post("/register", regAuthentication, handleRegistration)

Router.patch("/verify-account/:token", handleVerification)

Router.post("/login", loginAuthentication, handleLogin )

Router.get("/user-details", Authorization, handleUserDetails)

Router.get('/transaction/full-payment', Authorization, handleAllPropsTransaction)

Router.get('/transaction/installmental-payment', Authorization, handleInstallmentalTransaction)

Router.post("/forgot-password", handleForgotPassword)

Router.patch("/reset-password/:token", handleResetPassword)

Router.patch("/edit-records", Authorization, profileUpload.single('profile_pics'), handleEditRecords)

Router.patch("/deactivate-account", Authorization, handleDeactivateAcct)

Router.patch('/reactivate-account', Authorization, handleReactivateAcct)

Router.delete("/delete-account", Authorization, handleDeleteAccount)

Router.get("/logout", Authorization, handleLogout)

module.exports = Router;
