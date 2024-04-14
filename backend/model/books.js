const mongoose =  require ('mongoose');

const bookSchema = new mongoose.Schema({
    title : {type:String},
    author: {type:String},
    copiesofBook: {type:Number},
    returnCharges: {type:Number},
})

const Book = mongoose.model('Book', bookSchema)