const mongoose = require('mongoose');

// schema
var commentSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    post: {
        type: String,
        required: true,
        // isDeleted:{type:Boolean},
    },
    author: {
        type: String,
        required: true
    },
    parentComment: {
        type: String,
    },
    createdAt: {
        type:Date,
        default:Date.now
    },
    // updatedAt:{
    //     type:Date},
    },{
    toObject:{virtuals:true}
});

module.exports = mongoose.model('comment',commentSchema);