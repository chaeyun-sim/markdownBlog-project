const mongoose = require('mongoose');
const { marked } = require('marked');
const slugify = require('slugify');

const commentSchema = new mongoose.Schema({
    text: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    }
});

module.exports = mongoose.model('Comments', commentSchema);