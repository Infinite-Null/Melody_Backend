exports.generateOtp = (min = 10000, max = 99999)=>{
    let difference = max - min;
    let random = Math.random();
    random = Math.floor( random * difference);
    random = random + min;
    return random;
}