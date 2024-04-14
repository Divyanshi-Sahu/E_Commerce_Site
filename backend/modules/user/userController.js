const UserSchema = require('../../model/user');
const {ERROR_MESSAGES, SUCCESS_MESSAGES,ERROR_MESSAGES: { VALIDATION_MESSAGES}} = require('./userConstants');
const {generateToken} = require('../../authentication/auth')
const bcrypt = require('bcryptjs');

async function login(req,res) {
    try {
        const{ username,password } = req.body;
        const user = await UserSchema.findOne({
            $or:[
                {email: username},
                {mobile:username}
            ]
        });
        if(!user){
            throw({message:'User not registered'});
        }
        if(!bcrypt.compareSync(password,user.password)){
            throw({message:'password not matched'});
        }
        const token = generateToken(user);
        const options = {
          http: true,
          expiresIn: 7*24*60*60*1000 
        };
        return res.status(200).cookie('token', token, options).json({
          message: SUCCESS_MESSAGES.SUCCESSFULLY_REGISTERED,
          data: { user }
        })
      } catch (error) {
        console.log('something went wrong');
      }
}
async function logout(req,res) {
  try {
    return res.status(200).clearCookie('token').json({
      message: SUCCESS_MESSAGES.SUCCESSFULLY_REGISTERED,
      data: {}
    });
  } catch (error){
    return res.status(500).json({
      message: ERROR_MESSAGES.SOMETHING_WENT_WRONG,
      error,
    })
  }
}

async function signup(req,res) {
    try {
        const {
          name, email, mobile, profilePic, password,securityQuestion,securityAnswer
        } = req.body;
        const users = await UserSchema.find({
          $or: [
            {
              email
            },
            {
              mobile
            }
          ]
        });
        // if(users && users.length) {
        //   throw ({ message: VALIDATION_MESSAGES.EMAIL_OR_MOBILE_EXISTS })
        // }
        console.log(name, email, mobile, profilePic, password);
        const user = new UserSchema({
          name, email, mobile, profilePic, password,securityQuestion,securityAnswer
        });
        await user.save();
        const token = generateToken(user);
        const options = { 
          http: true,
          expiresIn: 7*24*60*60*1000 
        };
        return res.status(200).cookie('token', token, options).json({
          message: SUCCESS_MESSAGES.SUCCESSFULLY_REGISTERED,
          data: { user }
        })
      } catch (error) {
        console.log(error);
        return res.status(500).json({
          message: ERROR_MESSAGES.SOMETHING_WENT_WRONG,
          error,
        })
      }
}

async function getMyProfile(req,res) {
  try {
    const {user} = req;
    return res.status(200).json({
      data:{user},
      message: SUCCESS_MESSAGES.USER_FETCHED_SUCCESSFULLY
    })
  }
  catch(error){
    return res.status(500).json({
      message: ERROR_MESSAGES.SOMETHING_WENT_WRONG,
      error,
    })
  }
}

async function updateProfile(req,res) {
  try {
    const {email,mobile,name,profilePic} = req.body;
    const {user} = req;
    if(email){
      const userCount = await UserSchema.count({
        email,
        _id:{ $ne: user._id}
      })
    }
    if(userCount){
      throw ({ message: 'Email already registered with other user'});
    }
    if(mobile) {
      const userCount = await UserSchema.count({
        mobile,
        _id: { $ne: user._id }
      })
      if(userCount){
        throw ({ message: 'Mobile already registered with other user'});
      }
    }
    const updateQuery = {
      name,
      email,
      mobile,
      profilePic
    };
    await UserSchema.updateOne({_id: user._id},{$set: updateQuery });
    return res.status(201).json({
      message: SUCCESS_MESSAGES.SUCCESSFULLY_UPDATED_PROFILE,
      data: {}
    })
  } catch (error) {
    return res.status(500).json({
      message: ERROR_MESSAGES.SOMETHING_WENT_WRONG,
      error,
    }) 
  }
}

async function getUsers(req,res) {
      try {
        const {limit, skip, filters} = req.query;
    const whereClause = {};
    const {name, role , location} = filters;
    if(name){
      whereClause.name= name;
    }
    if(role){
      whereClause.role = role;
    };
    if(location){
      whereClause.location = location;
    } 
    
    
         const users = await UserSchema.find(whereClause).limit(limit).skip(skip);
         const usersCount = await UserSchema.count(whereClause);
         return res.status(200).json({
          data:{users},
          usersCount,
          message:SUCCESS_MESSAGES.USER_FETCHED_SUCCESSFULLY
         })

      } catch (error) {  
        console.log(error);
        return res.status(500).json({
          message:ERROR_MESSAGES.SOMETHING_WENT_WRONG
        })
      }
}


async function deleteUser(req,res) {
  try {
    const { id } = req.params;
    const users = await UserSchema.findById(id);
    if(!user){
     throw ({message:ERRORS_MESSAGES.VALIDATION_MESSAGES.USER_NOT_FOUND});
    }
    await UserSchema.deleteOne({ _id:id});
    return res.status(202).json({
      message:SUCCESS_MESSAGES.USER_DELETED_SUCCESSFULLY,
    })
 } catch (error) {
   return res.status(500).json({
     message: ERRORS_MESSAGES.SOMETHING_WENT_WRONG,
     error,
   })
 }
}

async function forgotPassword(req,res) {
    try {
      const{email,securityQuestion,securityAnswer} =req.body;
      const users = await UserSchema.find({
        email,securityQuestion
      });
      if(!users.length || user.length > 1){
        throw ({message:"user not found"});
      }
      const user = user[0];
      if(securityAnswer != user.securityAnswer){
        throw({message:"user answer not matched"});
      }
      const token = generateToken(user);
      const options = {
        http: true,
        expiresIn: 7*24*60*60*1000
      };
      return res.status(200).cookie('token', token,options).json({
        message:SUCCESS_MESSAGES.SUCCESSFULLY_REGISTERED,
        data:{}
      })
    } catch (error) {
       return res.status(500).json({
        message:ERROR_MESSAGES.SOMETHING_WENT_WRONG,
        error,
       });
    }
}


async function resetPassword(req,res) {
  try {
    const {user} = req;
    const {password, email} = req.body;
    if(email != user.email){
      throw({message:"email is not valid"});
    }
    await UserSchema.updateOne({_id: user._id}, {$set:password});
    return res.status(200).clearCookie('token').json({
      message: SUCCESS_MESSAGES.SUCCESSFULLY_REGISTERED,
      data: {}
    });
  } catch (error) {
    return res.status(500).json({
      message: ERROR_MESSAGES.SOMETHING_WENT_WRONG,
      error,
    });
  }
}

module.exports = {
    login,
    logout,
    signup,
    getMyProfile,
    updateProfile,
    getUsers,
    deleteUser,
    forgotPassword,
    resetPassword
}