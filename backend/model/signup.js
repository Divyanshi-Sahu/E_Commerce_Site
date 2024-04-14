const mongoose =  require ('mongoose');
const validator = require('validator');


const signupSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        // validator: validator.isAlpha,

    },
    phone_number:{
        type:String,
        required:true,
        // validator: validator.isNumeric,

    },
    email:{
        type: String,
        required: true, 
        unique:true,
        // validator: validator.isEmail,

    },

    password:{
        type: String,
        required: true,
        // min:[6, 'Should not be less than 6'],
        // max:[10, 'Password cannot be greater than length 10'],
        // validator: validator.isStrongPassword
    },
    role:{
        type: String,
        required: true,
        default:'customer',
        enum:['customer', 'admin']
    }
})

module.exports= mongoose.model('SignUp', signupSchema);