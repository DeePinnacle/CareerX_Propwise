const verifyAccount = (firstname, link) => {
    return (
        `
    <div id='container' style='
        background-color: white;
        width: 100%;
        min-height: 100vh;
    '>

        <div style="padding: 10px; box-sizing: border-box; width: 100%; max-width: 400px; margin: 10px auto;">
            <div style="
            background-color: white; 
            width: 100%;
            padding:50px 20px; 
            box-sizing: border-box;
            border-radius: 10px;
            box-shadow: 0px 0px 8px 2px rgba(0, 0, 0, 0.2);
            ">
                <div style="display: flex; flex-direction: row; align-items: center; gap: 10px;">
                    <image src="Logo.png" style="width: 50px; height: 20px; display: block; margin: 0px auto;" />
                    <h2 style="color: #E45122; margin-right: 500px; font-family: cursive;">Propwise</h2>
                </div>
                <div style="width: 100%; min-height: 20px; background-color: #E45122; border-radius: 4px; padding: 10px; box-sizing: border-box;">
                    <image src="verify.png" style="width: 150px; height: 150px; display: block; margin: 0px auto;" />
                </div>
                <h2 style="text-align: left; color: #E45122; font-size: 1rem; font-weight: bold; font-family:'Times New Roman', Times, serif">You are almost there!</h2>
                <p style="color: black; text-align:left; font-size: 2rem; margin: 16px 0px; font-family:'Times New Roman', Times, serif; font-weight: 700;">Verify your email address</p>
                <p style="font-weight: bold;">Hello ${ firstname },</p>
                <hr />
                <p style="color: black; margin: 16px 0px; font-family: cursive;">
                    Thank you for creating an account with us! To complete your registration and activate your account, please verify your email address by clicking the link below:
                </p>
                <div style="
                background-color: #E45122;
                width: 50%;
                padding: 10px 8px;
                box-sizing: border-box;
                border-radius: 6px;
                ">
                    <a href='${link}' style="
                    display: block;
                    text-decoration: none;
                    color: white;
                    text-align: center;
                    font-family: cursive;
                ">verify account</a>
                </div>
                <p style="margin: 24px 0px; color: black ; font-family: cursive;">
                    If you did not create this account, please disregard this email. If you encounter any issues or need assistance, feel free to contact our support team at <span style="color: #E45122">krakenteam@propwise.co</span>.
                </p>
                <hr />
                <p style="font-family: cursive;">Thank you for joining us!</p>
                <p style="font-family: cursive;">Best regards,<br />
                The Kraken Team</p>

            </div>
        </div>

        `
    )
}

const resetPass = (firstname, resetPassLink) => {
    return (
        `
            <div>
                <h1>Hello ${ firstname }</h1>
                <p>Click the link below to reset your password.</p>
                <a href=${ resetPassLink}>Reset Password</a>
            </div>
        `
    )
}

module.exports = {
    verifyAccount,
    resetPass
}