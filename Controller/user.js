const displayError = require("../Formatters/displayError")
const { successResponse, failResponse } = require("../Formatters/displayResponse")
const { sendVerificationMail } = require("../Helper/user/sendVerificationMail")
const User = require("../Models/user")
const { generateOtp } = require("../Utils/generateOtp")
const bcrypt = require("bcryptjs")
var jwt = require('jsonwebtoken')
// signup logic
exports.signup  = async (req , res) => {
  try{
    const {email, password} = req.body
    if(email && password){
        try{
          const user = await User.findOne({email})
          if(!user){
            const OTP = generateOtp()
            const success = await sendVerificationMail(OTP,email)
            if(success){
              const newUser = new User({
                OTP,
                email,
                password
              })
              await newUser.save()
              successResponse(res,{
                message:"Verification code is sent to your mail please verify.",
                email,
              },200)
            }else{
              failResponse(res)
            }
          }else{
            failResponse(res,"Already a user", 409)
          }
        }catch(e){
          displayError("Signup find one", e)
          failResponse(res)
        }
    } else {
        failResponse(res,"Please provide email and password",422)
    }
  } catch (e) {
     failResponse(res)
     displayError("Signup User",e)
  }
}

// verify otp logic
exports.verify = async (req, res) => {
  try{
    const {email, OTP} = req.body
    if(email && OTP){
        const user = await User.findOne({email}).select("isVerified OTP")
        if(user){
          if(user.isVerified){
            failResponse(res,"User Already Verified",409)
          }else{
            if(user.OTP === OTP){
                user.isVerified = true
                user.OTP = "null"
                await user.save()
                successResponse(res)
            } else {
              failResponse(res,"Wrong OTP",400)
            }
          }
        }else{
          failResponse(res,"User not found",404)
        }
    }else{
      failResponse(res,"Please provide email and OTP",422)
    }
  }catch (e){
    failResponse(res)
    displayError("Verify User",e)
  }
}
// send otp logic
exports.sendOtp = async (req, res) => {
  try{
    const {email} = req.body
    if(email){
      const user = await User.findOne({email}).select('OTP')
      if(user){
        const OTP = generateOtp()
        const success = await sendVerificationMail(OTP,email)
        if(success){
          user.OTP = OTP
          await user.save()
          successResponse(res)
        }else{
          failResponse(res)
        }
      }else{
        failResponse(res,"No user with given email", 404)
      }
    }else{
      failResponse(res,"Please provide email",422)
    }
  } catch (e) {
    failResponse(res)
    displayError("Send Otp",e)
  }
}

// login user logic
exports.login = async (req, res) => {
  try {
    const {email , password} = req.body
    if (email && password){
        const user = await User.findOne({email}).select('password isVerified')
        if(user){
          if(user.isVerified){
             const correctPassword = await bcrypt.compare(password, user.password)
             if(correctPassword){
                const token = jwt.sign({ email: email }, process.env.JWT_SECRET,{
                  expiresIn:process.env.JWT_EXPIRE
                })
                successResponse(res,{
                  message:"Success Login",
                  token,
                  email
                },200)
             } else {
              failResponse(res,"Incorrect Password", 401)
             }
          } else {
            failResponse(res,"User is not verified", 401)
          } 
        }else{
          failResponse(res,"No user with given email", 404)
        }
    } else {
      failResponse(res,"Please provide email and password",422)
    }
  } catch (e) {
    failResponse(res)
    displayError("Login User",e)
  }
}

// reset password logic
exports.resetPassword = async (req, res) => {
  try{
    const {email, OTP, newPassword} = req.body
    // console.log(email, OTP, newPassword);
    if(email && OTP && newPassword){
      const user = await User.findOne({email}).select("OTP")
      if(user){
        if(user.OTP !== 'null'){
          if(user.OTP === OTP){
            user.password = newPassword
            user.OTP = "null"
            await user.save()
            successResponse(res,{
              message:"Password Updated Successfully",
            }, 200)
          } else {
            failResponse(res,"Wrong OTP",400)
          }
        }else{
          failResponse(res,"Please generate OTP first",404)
        }
      } else {
        failResponse(res,"No user with given email",404)
      }
    }else{
      failResponse(res,"Please provide email, OTP, and newPassword", 422)
    }
  }catch(e){
    failResponse(res)
    displayError("Reset Password",e)
  }
}