const mongoose = require('mongoose');
const slugify = require('slugify');
const { JSDOM } = require('jsdom');

const categorySchema = mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true,
    },
    description : {
        type: String,
        required: false,
    }
    },{
    versionKey: false,
});

module.exports = mongoose.model('category', categorySchema);