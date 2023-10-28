const mongoose = require('mongoose');

// creating the user schema here
const userSchema = new mongoose.Schema({
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    username : {
        type : String,
        required : true,
        unique : true
    }
}, {timestamps : true})

module.exports = new mongoose.model('User', userSchema)