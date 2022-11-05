const mongoose = require('mongoose');

// schema
var commentSchema = mongoose.Schema({
    post: {
        type: String,
        required: true,
        // isDeleted:{type:Boolean},
    },
    writer: {
        type: String,
        required: true
    },
    createdAt: {
        type:Date,
        default:Date.now
    },
    // updatedAt:{
    //     type:Date},
    },{
    // toObject:{virtuals:true},
    versionKey: false,
});

module.exports = mongoose.model('comment',commentSchema);