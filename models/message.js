const mongoose = require('mongoose');
const Member = require('./member');


const messageSchema = new mongoose.Schema({
    date:{
        type:Date
    },
    heading:{
        type:String
    },
    body : {
        type:String
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Member'
    }
});

const Message = mongoose.model('Message',messageSchema);

module.exports = Message;