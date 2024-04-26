const displayError = require("../../Formatters/displayError")
const { generateVerificationMail } = require("../../Utils/generateVerificationMail")

exports.sendVerificationMail = async(OTP, email) => {
    try {
        await generateVerificationMail(OTP, email)
        return true
    } catch (e) {
        displayError("Sending Mail", e)
        return false
    }
}