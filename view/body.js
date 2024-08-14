const verifyAccount = (firstname, link) => {
    // let imageLink = `https://github.com/DeePinnacle/CareerX_Propwise/blob/main/Logo.png?raw=true`
    let imageLink = `https://images.pexels.com/photos/164558/pexels-photo-164558.jpeg`
    return (
        `
        <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>confrim mail body</title>
</head>

<body style="margin: 0;">
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
                    <img src=${imageLink} alt="propwise-logo" style="width: 50px; height: 20px; display: block; margin: 0px auto;" />
                    <h2 style="color: #E45122; margin-right: 500px; font-family: 'Times New Roman', Times, serif;">Propwise</h2>
                </div>
                <div style="width: 100%; min-height: 20px; background-color: #E45122; border-radius: 4px; padding: 10px; box-sizing: border-box;">
                    <img src='https://images.app.goo.gl/XSF8BQicyaSn86nCA' alt="envelope logo" style="width: 150px; height: 150px; display: block; margin: 0px auto;" />
                </div>
                <h2 style="text-align: left; color: #E45122; font-size: 1rem; font-weight: bold; font-family:'Times New Roman', Times, serif">You are almost there!</h2>
                <p style="color: black; text-align:left; font-size: 2rem; margin: 16px 0px; font-family:'Times New Roman', Times, serif; font-weight: 700;">Verify your email address</p>
                <p style="font-weight: bold; font-family: 'Times New Roman', Times, serif;">Hello ${ firstname },</p>
                <hr />
                <p style="color: black; margin: 16px 0px; font-size: 1.2rem; font-family: 'Times New Roman', Times, serif;">
                    Thank you for creating an account with us! To complete your registration and activate your account, please verify your email address by clicking the link below:
                </p>
                <div style="
                background-color: #E45122;
                width: 50%;
                padding: 10px 8px;
                box-sizing: border-box;
                border-radius: 6px;
                ">
                    <a href='${ link }' style="
                    display: block;
                    text-decoration: none;
                    color: white;
                    text-align: center;
                    font-family: 'Times New Roman', Times, serif;
                ">verify account</a>
                </div>
                <p style="margin: 24px 0px; color: black ; font-size: 1.2rem; font-family: 'Times New Roman', Times, serif;">
                    If you did not create this account, please disregard this email. If you encounter any issues or need assistance, feel free to contact our support team at <span style="color: #E45122">krakenteam@propwise.co</span>.
                </p>
                <hr />
                <p style="font-family: 'Times New Roman', Times, serif;">Thank you for joining us!</p>
                <p style="font-family: 'Times New Roman', Times, serif;">Best regards,<br />
                The Kraken Team</p>

            </div>
        </div>
</body>

</html>

        `
    )
}

const resetPass = (firstname, resetPassLink) => {
    return (
        `
        <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>confrim mail body</title>
</head>

<body style="margin: 0;">
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
                    <img src='https://images.app.goo.gl/XSF8BQicyaSn86nCA' alt="propwise-logo" style="width: 50px; height: 20px; display: block; margin: 0px auto;" />
                    <h2 style="color: #E45122; margin-right: 500px; font-family: 'Times New Roman', Times, serif;">Propwise</h2>
                </div>
                <div style="width: 100%; min-height: 20px; background-color: #E45122; border-radius: 4px; padding: 10px; box-sizing: border-box;">
                    <img src='https://images.app.goo.gl/XSF8BQicyaSn86nCA' alt="envelope logo" style="width: 150px; height: 150px; display: block; margin: 0px auto;" />
                </div>
                <p style="color: black; text-align:left; font-size: 2rem; margin: 16px 0px; font-family:'Times New Roman', Times, serif; font-weight: 700;">Reset password</p>
                <p style="font-weight: bold; font-family: 'Times New Roman', Times, serif;">Hello ${ firstname },</p>
                <hr />
                <p style="color: black; margin: 16px 0px; font-size: 1.2rem; font-family: 'Times New Roman', Times, serif;">
                    We received a request to reset the password for your account. Please use the link below to create a new password:
                </p>
                <div style="
                background-color: #E45122;
                width: 50%;
                padding: 10px 8px;
                box-sizing: border-box;
                border-radius: 6px;
                ">
                    <a href='${ resetPassLink }' style="
                    display: block;
                    text-decoration: none;
                    color: white;
                    text-align: center;
                    font-family: 'Times New Roman', Times, serif;
                ">reset password</a>
                </div>
                <p style="font-size: 1.2rem;">
                    This link will expire in 30 minutes. If you need another link or have any issues, please visit our support page or contact us directly.
                </p>
                <p style="margin: 24px 0px; color: black ; font-size: 1.2rem; font-family: 'Times New Roman', Times, serif;">
                    If you did not request this change, please ignore this email. <br /> <br /> If you encounter any issues or need assistance, feel free to contact our support team at <span style="color: #E45122">krakenteam@propwise.co</span>.
                </p>
                <hr />
                <p style="font-family: 'Times New Roman', Times, serif;">Thank you for joining us!</p>
                <p style="font-family: 'Times New Roman', Times, serif;">Best regards,<br />
                The Kraken Team</p>

            </div>
        </div>
</body>

</html>

        `
    )
}

module.exports = {
    verifyAccount,
    resetPass
}