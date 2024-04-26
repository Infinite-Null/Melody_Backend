const nodeMailer = require("nodemailer");

exports.generateVerificationMail = async(OTP,email) => {
    const transporter = nodeMailer.createTransport({
        service: process.env.SMPT_SERVICE,
        secure: true,
        auth: {
            user: process.env.SMPT_MAIL,
            pass: process.env.SMPT_PASSWORD
        }
    })
    const mailOptions = {
        from: process.env.SMPT_MAIL,
        to: email,
        subject: "Verification",
        html: '<div style="height: 350px;background-color: white"><center><img src="https://i.pinimg.com/originals/dc/c9/ce/dcc9cea8525b59b91d1a6ed0e27fff59.gif" style="height: 200px;width: 200px"/></center><h1 style="color: #00aced;text-align: center">YOUR OTP IS</h1>' +
            `<center><h1 style="color: rgb(255, 165, 47);margin-top: 5px;">${OTP}</h1></center></div>`
    }
    await transporter.sendMail(mailOptions)
}

