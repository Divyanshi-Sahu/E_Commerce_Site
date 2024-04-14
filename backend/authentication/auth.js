const jwt = require('jsonwebtoken');
const UserSchema = require('../model/user');
const secretKey = 'divyanshi'
const authorizeRoles = ['admin'];

function generateToken(data){
    console.log(data);
    const token = jwt.sign(data={id:data._id}, secretKey);
    return token;
}

async function authenticate(req,res,next){
    try {
        const { token } = req.cookies;
        if(!token){
            throw({message:'please login before access'});
        }
        const decodedData = jwt.verify(token,secretKey);
        const{id}= decodedData;
        const user = await UserSchema.findById(id);
        if(!user){
            throw({message:'Unable to identify the user,please login again'});
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(404).json({
            message:'Something went wrong',
            error,
        })
    }
}

function authorize(req,res,next){
    try {
        const {user} = req;
        const {role} = user;
        if(authorizeRoles.find((element) => element === role)){
            return next();
        }
        return res.status(401).json({
            message: 'You are not authorize to access',
            error:{
                message:'unauthorized'
            },
        })
    } catch (error) {
        console.log(error);
        return res.status(404).json({
            message:'Something went wrong',
            error,
        })
    }
}

module.exports = {authorize,authenticate,generateToken}
