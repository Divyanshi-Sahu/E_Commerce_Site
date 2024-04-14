const mongoose =  require ('mongoose');

const postSchema = new mongoose.Schema({
    text:String,
    image:String,
    user: String,
    date: Date,
    likes:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
    comments:[{
        user:{
            type:mongoose.Schema.Types.ObjectId,
             ref:'User',
             required:false,
        },
        text:String,
    }],
})

module.exports= mongoose.model('Posts', postSchema);

















// books issues return chargesisuuename multipple copy