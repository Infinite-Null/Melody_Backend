const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema({
    OTP: {
        type: String,
        required: [true, "No verification id"],
        select: false
    },
    isVerified: {
        type: Boolean,
        default: false,
        select: false
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: true,
        validate: [validator.isEmail, "Please enter valid email"]
    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
        minLength: [8, "password should be more than 8 character"],
        select: false
    },
})

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next()
    }
    this.password = await bcrypt.hash(this.password, 10)
})


module.exports = mongoose.model("User", userSchema)
