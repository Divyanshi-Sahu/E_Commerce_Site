const mongoose = require('mongoose');

const bookIssueSchema = new mongoose.Schema({
    book:{
        type:mongoose.Schema.Types.ObjectId,
        member: mongoose.Schema.Types.ObjectId,
        issueDate: Date,
        returnDate: Date,
        charges: Number,
    }
})

module.exports = mongoose.model('BookIssue', bookIssueSchema)