const handleHome = ("/", (req, res)=>{
    return res.status(200).json({ message: "Welcome to propwise API", 
        APIs: { 
            userAPI: "/propwise/user/api", 
            AdminAPI: "/propwise/admin/api",
            propetyAPI: "/propwise/property/api",
            walletAPI: "/propwise/wallet/api",
            transactionAPI: "propwise/transactions/api"
        } })
})

module.exports = {
    handleHome
}