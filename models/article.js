const mongoose = require('mongoose');
const { marked } = require('marked');
const slugify = require('slugify');
const createDomPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const dompurify = createDomPurify(new JSDOM().window);

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    markdown: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    writer: {
        type: String,
        required: true,
    },
    category : {
        type: String,
        ref: 'Category',
        required: false,
    },
    indexNum : {
        type: Number,
        required: true,
    },
    isDeleted: {
        type: Boolean,
        required: true,
    },
    slug: {
        type: String,
        required: true,
        unique: false,
    },
    sanitizedHtml: {
        type: String,
        required: true,
    },
});

articleSchema.pre('validate', function() {
    if (this.title) {
        this.slug = slugify(this.title, { lower: true, strict: true });
    }
    if (this.markdown) {
        this.sanitizedHtml = dompurify.sanitize(marked(this.markdown));
    }
});

module.exports = mongoose.model('Article', articleSchema);