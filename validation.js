const joi = require("@hapi/joi");

const signUpValidation = (data)=>{
    const schema = joi.object({
        email  : joi.string().email().label('Email').min(7).required(),
        password : joi.string().min(8).label('Password').max(20).required(),
        username : joi.string().max(12).label('Username').required()
    })
    return schema.validate(data)
}

const loginValidation = (data) => {
    const schema = joi.object({
        email  : joi.string().email().label('Email').min(7).required(),
        password : joi.string().min(8).label('Password').max(20).required(),
    })
    return schema.validate(data)
}

const refreshTokenValidation = (data) => {
    const schema = joi.object({
        refreshToken: joi.string().required().label("Refresh Token"),
    });
    return schema.validate(data);
}


module.exports.signUpValidation = signUpValidation;
module.exports.loginValidation = loginValidation;
module.exports.refreshTokenValidation = refreshTokenValidation;