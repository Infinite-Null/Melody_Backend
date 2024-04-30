const jwt = require("jsonwebtoken")
const User = require("../Models/user");
const { failResponse } = require("../Formatters/displayResponse")
const displayError = require("../Formatters/displayError")

const isAuththenticatedUser = async (req, res, next) => {
    const {token} = req.headers
    if(token){
        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                displayError("Token Verification", err)
                failResponse(res, "Unauthorized", 401)
                return
            }else if(!decoded){
                failResponse(res, "Unauthorized", 401)
                return
            } else {
                try{
                    const user = await User.findOne({email:decoded.email})
                    if(!user){
                        failResponse(res, "Unauthorized", 401)
                        return
                    }
                    else{
                        req.user = decoded
                        next()
                    }
                } catch(e) {
                    displayError("Token Verification", err)
                    failResponse(res, "Unauthorized", 401)
                    return
                }
            }
        })
    } else {
        failResponse(res,"Unauthorized", 401)
    }
}

module.exports = isAuththenticatedUser