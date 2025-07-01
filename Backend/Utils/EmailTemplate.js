// Html template for verfiying email template
const verifyEmail = (token) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <style>
    .button {
        appearance: button;
        backface-visibility: hidden;
        background-color: #405cf5;
        border-radius: 6px;
        border-width: 0;
        box-shadow: rgba(50, 50, 93, .1) 0 0 0 1px inset,rgba(50, 50, 93, .1) 0 2px 5px 0,rgba(0, 0, 0, .07) 0 1px 1px 0;
        box-sizing: border-box;
        color: white;
        cursor: pointer;
        font-family: -apple-system,system-ui,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif;
        font-size: 100%;
        height: 44px;
        line-height: 1.15;
        margin: 12px 0 0;
        outline: none;
        overflow: hidden;
        padding: 0 25px;
        position: relative;
        text-align: center;
        text-transform: none;
        transform: translateZ(0);
        transition: all .2s,box-shadow .08s ease-in;
        user-select: none;
        -webkit-user-select: none;
        touch-action: manipulation;
        width: 100%;
    }
    .button:disabled {
    cursor: default;
    }
    .button:focus {
    box-shadow: rgba(50, 50, 93, .1) 0 0 0 1px inset, rgba(50, 50, 93, .2) 0 6px 15px 0, rgba(0, 0, 0, .1) 0 2px 2px 0, rgba(50, 151, 211, .3) 0 0 0 4px;
    }
    .p-tag{
        color: rgb(0, 118, 255);
        font-family: "Helvetica", "Arial", "sans-serif";
        font-size: 2.25rem;
        text-align: center;
    }
    .p-tag2{
        color: rgb(109, 118, 128) !important;
        font-family: "Helvetica", "Arial", "sans-serif";
        text-align: center;
        font-size: 1.25rem;
    }
    </style>
        <meta charset="UTF-8">
        <br>
    </head>
    <body>
        <div class="wrapper">
            <p class="p-tag">
                Welcome to eTimely!
            </p>
            <p class="p-tag2">
            <Br>To complete your registration, please verify your email address by clicking the button below.
            </p>
            <Br>
            <Button class="button"><a style="color: white" type="button" href="http://localhost:3000/verify/${token}">Verify your account</a></Button>
        </div>
    </body>
    </html>
    `;
}

// Html template for reset password email template
const resetPasswordEmail = (token) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <style>
    .button {
        appearance: button;
        backface-visibility: hidden;
        background-color: #405cf5;
        border-radius: 6px;
        border-width: 0;
        box-shadow: rgba(50, 50, 93, .1) 0 0 0 1px inset,rgba(50, 50, 93, .1) 0 2px 5px 0,rgba(0, 0, 0, .07) 0 1px 1px 0;
        box-sizing: border-box;
        color: white;
        cursor: pointer;
        font-family: -apple-system,system-ui,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif;
        font-size: 100%;
        height: 44px;
        line-height: 1.15;
        margin: 12px 0 0;
        outline: none;
        overflow: hidden;
        padding: 0 25px;
        position: relative;
        text-align: center;
        text-transform: none;
        transform: translateZ(0);
        transition: all .2s,box-shadow .08s ease-in;
        user-select: none;
        -webkit-user-select: none;
        touch-action: manipulation;
        width: 100%;
    }
    .button:disabled {
    cursor: default;
    }
    .button:focus {
    box-shadow: rgba(50, 50, 93, .1) 0 0 0 1px inset, rgba(50, 50, 93, .2) 0 6px 15px 0, rgba(0, 0, 0, .1) 0 2px 2px 0, rgba(50, 151, 211, .3) 0 0 0 4px;
    }
    .p-tag{
        color: rgb(0, 118, 255);
        font-family: "Helvetica", "Arial", "sans-serif";
        font-size: 2.25rem;
        text-align: center;
    }
    .p-tag2{
        color: rgb(109, 118, 128) !important;
        font-family: "Helvetica", "Arial", "sans-serif";
        text-align: center;
        font-size: 1.25rem;
    }
    </style>
        <meta charset="UTF-8">
        <br>
    </head>
    <body>
        <div class="wrapper">
            <p class="p-tag">
                eTimely
            </p>
            <p class="p-tag2">
            Reset Password
            <Br>To reset your password, please click the button below. If you did not request a password reset, please ignore this email.
            </p>
            <Br>
            <Button class="button"><a style="color: white" type="button" href="http://localhost:3000/changePassword/${token}">Reset your password</a></Button>
        </div>
    </body>
    </html>
    `;
}

const invteStaffEmail = (token, staffFirstName, staffLastName, companyName, staffEmail) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <style>
    .button {
        appearance: button;
        backface-visibility: hidden;
        background-color: #405cf5;
        border-radius: 6px;
        border-width: 0;
        box-shadow: rgba(50, 50, 93, .1) 0 0 0 1px inset,rgba(50, 50, 93, .1) 0 2px 5px 0,rgba(0, 0, 0, .07) 0 1px 1px 0;
        box-sizing: border-box;
        color: white;
        cursor: pointer;
        font-family: -apple-system,system-ui,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif;
        font-size: 100%;
        height: 44px;
        line-height: 1.15;
        margin: 12px 0 0;
        outline: none;
        overflow: hidden;
        padding: 0 25px;
        position: relative;
        text-align: center;
        text-transform: none;
        transform: translateZ(0);
        transition: all .2s,box-shadow .08s ease-in;
        user-select: none;
        -webkit-user-select: none;
        touch-action: manipulation;
        width: 100%;
    }
    .button:disabled {
    cursor: default;
    }
    .button:focus {
    box-shadow: rgba(50, 50, 93, .1) 0 0 0 1px inset, rgba(50, 50, 93, .2) 0 6px 15px 0, rgba(0, 0, 0, .1) 0 2px 2px 0, rgba(50, 151, 211, .3) 0 0 0 4px;
    }
    .p-tag{
        color: rgb(0, 118, 255);
        font-family: "Helvetica", "Arial", "sans-serif";
        font-size: 2.25rem;
        text-align: center;
    }
    .p-tag2{
        color: rgb(109, 118, 128) !important;
        font-family: "Helvetica", "Arial", "sans-serif";
        text-align: center;
        font-size: 1.25rem;
    }
    </style>
        <meta charset="UTF-8">
        <br>
    </head>
    <body>
        <div class="wrapper">
            <p class="p-tag">
            Welcome to eTimely!
            </p>
            <p class="p-tag2">
            Invitation to join eTimely
            <Br>Hello, ${staffFirstName} ${staffLastName}, You have been invited to join eTimely by ${companyName}.<Br>To continue, set your password and sign in with your email address <br>
            ${staffEmail}.
            </p>
            <Br>
            <Button class="button"><a style="color: white" type="button" href="http://localhost:3000/Staff/Signup/${token}">Set Your Password</a></Button>
        </div>
    </body>
    </html>
    `;
}

// HTML template for contact us email
const contactUsTemplate = (name, email, message) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    
    <body>
        <div class="wrapper">
            <p class="p-tag2">
            Contact Us Information
            <Br>
            <Br>
            Name: ${name}
            <Br>
            <Br>
            Email: ${email}
            <Br>
            <Br>
            Message: ${message}
            </p>
            <Br>
            <Br>
        </div>
    </body>
    </html>
    `;
}







// Export module
module.exports = {
    verifyEmail,
    resetPasswordEmail,
    invteStaffEmail,
    contactUsTemplate
}