const mongoose=require("mongoose")
const displayError = require("../Formatters/displayError")

const connectDb=()=>{
    mongoose.connect(process.env.URI).then((e)=>{
        console.log('DB Connected')
    }).catch((e)=>{
        displayError(" DB Connection ",e)
    })
}

module.exports=connectDb
