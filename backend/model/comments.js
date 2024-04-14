const mongoose =  require ('mongoose');

const commentSchema =  new mongoose.Schema({
    post:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Posts',
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    
})

module.exports= mongoose.model('Comments', commentSchema);