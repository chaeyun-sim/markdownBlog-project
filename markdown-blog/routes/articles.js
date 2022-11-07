const express = require('express');
const Article = require('./../models/article');
const Comments = require('./../models/comment');
const bodyParser = require('body-parser');
const router = express.Router();
const uniqid = require('uniqid');

router.get('/new', (req, res) => {
    res.render('articles/new', { article: new Article() })
});

router.get('/edit/:id', async (req, res) => {
    const article = await Article.findById(req.params.id);
    res.render('articles/edit', { article: article })
});

router.get('/:slug', async (req, res) => {
    const article = await Article.findOne({ slug: req.params.slug });
    const comment = await Comments.find({parentTitle: article.title }).sort({ createdAt: 'desc' });
    if (article == null) res.redirect('/');
    res.render('articles/show', { article: article, comments: comment, comment: new Comments() });
});

router.post('/:slug/comment', async (req, res) => {
    const article = await Article.findOne({ slug: req.params.slug });
    const comment = new Comments({
        parentTitle: article.title,
        writer: req.body.writer,
        post: req.body.post,
        slug: uniqid(),
    });
    try {
        await comment.save();
        console.log("saved!")
        res.status(301).redirect(`/articles/${article.slug}`);
    } catch (e) {
        console.log(`catch error when saving comments: ${e}`);
        res.redirect('/');
    };
});

router.post('/', async (req, res, next) => {
    req.article = new Article();
    next();
}, saveArticleAndRedirect('new'));

router.put('/:id', async (req, res, next) => {
    req.article = await Article.findById(req.params.id);
    next();
}, saveArticleAndRedirect('edit'));

router.delete('/:id', async (req, res) => {
    await Article.findByIdAndDelete(req.params.id);
    res.redirect('/');
});

router.post('/comment/save', (req, res) => {
    res.send(req.body.author)
});

router.get('/:slug/:id', async (req, res) => {
    const article = await Article.findOne({ slug: req.params.slug });
    const comments = await Comments.find({parentTitle: article.title }).sort({ createdAt: 'desc' });
    const comment = await Comments.findOne({ id: req.params.id });
    res.render('articles/edit_comments', { article: article, comments: comments, comment: comment})
});

router.put('/:slug', async (req, res) => {
    // 수정파트
    // "/articles/<%= article.slug %>?_method=PUT"
});

function saveArticleAndRedirect(path) {
    return async (req, res) => {
        let article = req.article;
        article.title = req.body.title;
        article.description = req.body.description;
        article.markdown = req.body.markdown;
        try {
            await article.save();
            res.redirect('/articles/'+ article.slug);
        } catch (err) {
            console.log(err);
            res.render(`articles/${path}`, { article: article });
        };
    };
};

module.exports = router;