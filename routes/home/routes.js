const express = require("express")
const { handleHome } = require("../../controllers/home/propwise")

const Router = express.Router()

Router.get("/", handleHome)

module.exports = Router