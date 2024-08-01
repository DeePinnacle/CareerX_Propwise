const verifyAccount = (email, link) => {
    return (
        `
            <div id='container' style='
               background-color: rgb(22, 22, 22);
               width: 100%;
               min-height: 100vh;
            '>
            <div id="logo" style='
               display: flex;
               flex-direction: row;
               align-items: center;
               justify-content: center;
               color: white;
               background-color: #0088CA;
            '>
            <p style="
                font-family: cursive;
                font-weight: 700;
                font-size: larger;
                ">
                Propwise
            </p>
        </div>
        <div style="padding: 10px; box-sizing: border-box; width: 100%; max-width: 400px; margin: 10px auto;">
            <div style="
            background-color: rgb(10, 10, 10); 
            width: 100%;
            padding:20px 10px; 
            box-sizing: border-box;
            border-radius: 10px;
            ">
                <div style="
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            margin: 10px auto; 
            width: 100px; 
            height: 100px; 
            background-color: #0088CA; 
            border-radius: 50%;
            ">
                    <h5 style="color: rgb(184, 180, 180)">Mail icon</h5>
                </div>
                <h2 style="color: rgb(184, 180, 180); text-align: center;">Confirm you email</h2>
                <p style="color: rgb(184, 180, 180); text-align:center; margin: 16px 0px;">Welcome { Username }!, thanks
                    for choosing Propwise</p>
                <hr />
                <p style="color: rgb(184, 180, 180); word-spacing: 10px; margin: 16px 0px;">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet necessitatibus excepturi voluptates
                    tenetur et inventore, explicabo neque! Saepe excepturi, neque adipisci debitis beatae commodi cum
                    aspernatur quisquam, necessitatibus qui autem.
                </p>
                <p style="margin: 24px 0px; color: rgb(184, 180, 180) ;">
                    an account was created on propwise with the following email:
                    <span>examplemail@gmail.com</span>
                </p>
                <p style="color: rgb(184, 180, 180);">To continue on propwise kindly verify your mail by clicking the
                    button below. </p>

                <div style="
                background-color: #0088CA;
                width: 100%;
                padding: 10px 8px;
                box-sizing: border-box;
                border-radius: 6px;
                ">
                    <a href=${ link } style="
                    display: block;
                    text-decoration: none;
                    color: white;
                    text-align: center;
                ">verify account</a>
                </div>
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