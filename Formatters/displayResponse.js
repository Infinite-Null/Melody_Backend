exports.successResponse = (res, data, statusCode=200) => {
   if(data){
    res.status(statusCode).json({
        success:true,
        data:data
    })
   } else {
    res.status(statusCode).json({
        success:true,
    })
   }
}

exports.failResponse = (res,message,statusCode=500) => {
    if(statusCode === 500){
        res.status(statusCode).json({
            success:false,
            message:"Something went wrong"
        })
    } else {
        res.status(statusCode).json({
            success:false,
            message:message
        })
    }
}
