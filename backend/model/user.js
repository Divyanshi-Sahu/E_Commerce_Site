const mongoose =  require ('mongoose');
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);

const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    profilePic: {
      type: String,
      required: true
    },
    mobile: {
      type: String,
      required: true,
      ///validator: validator.isNumeric,
    },
    email: {
      type: String,
      required: true,
      ///validator: validator.isEmail,
    },
    password: {
      type: String,
      required: true,
      //validator: validator.isStrongPassword
    },
    role: {
      type: String,
      required: true,
      default: 'customer',
      enum: [
        'customer',
        'admin'
      ]
    },
    securityQuestion: {
      type: String,
      required: true,
      enum: [
        'what is your nick name?',
        'what is your hometown?',
        'What is your mother and fathers nick name?'
      ]
    },
    securityAnswer: {
      type: String,
      required: true,
    }
  })

  userSchema.pre('save', function(){
    if (this.isModified('password')) {
      this.password =  bcrypt.hashSync(this.password, salt);
    }
  })
  
module.exports= mongoose.model('User', userSchema);