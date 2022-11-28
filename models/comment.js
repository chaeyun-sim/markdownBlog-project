const mongoose = require('mongoose');
const slugify = require('slugify');
const { JSDOM } = require('jsdom');

const commentSchema = mongoose.Schema({
    parentTitle: {
        type: String,
        unique: false,
    },
    post: {
        type: String,
        required: true,
        // isDeleted:{type:Boolean},
        unique: false,
    },
    writer: {
        type: String,
        required: true,
        unique: false,
    },
    createdAt: {
        type:Date,
        default:Date.now,
        unique: false,
    },
    isDeleted: {
        type: Boolean,
        required: true,
        default: false,
    },
    isUpdated : {
        type: Boolean,
        required: true,
        default: false,
    },
    slug: {
        type: String,
        unique: false,
    },
    updatedAt: {
        type:Date,
        default:Date.now,
        unique: false,
    },
    // updatedAt:{
    //     type:Date},
    },{
    // toObject:{virtuals:true},
    versionKey: false,
});

commentSchema.pre('validate', function() {
    if (this.title) {
        this.slug = slugify(this.title, { lower: true });
    }
});

module.exports = mongoose.model('comment',commentSchema);