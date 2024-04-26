const express = require('express')
const { signup, verify, sendOtp, login, resetPassword } = require('../Controller/user')
const router = express.Router()

router.route("/signup").post(signup)
router.route("/verify").post(verify)
router.route("/sendOtp").post(sendOtp)
router.route("/login").post(login)
router.route("/resetPassword").post(resetPassword)

module.exports = router