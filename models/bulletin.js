const mongoose = require('mongoose');
const Message = require('./member');


const bulletinSchema = new mongoose.Schema({
    messages:[
        
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Message'
        }
    ]
});

const Bulletin = mongoose.model('Bulletin',bulletinSchema);

module.exports = Bulletin;