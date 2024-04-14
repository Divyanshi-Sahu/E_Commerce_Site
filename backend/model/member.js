const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
    name: String,
    email: String,
    membershipDate:Date,
})

module.exports = mongoose.model('Member', memberSchema);