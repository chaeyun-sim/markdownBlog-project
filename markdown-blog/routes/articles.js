const express = require('express');
const Article = require('./../models/article');
const Comments = require('./../models/comment');
const bodyParser = require('body-parser');
const router = express.Router();

router.get('/new', (req, res) => {
    res.render('articles/new', { article: new Article() })
});

router.get('/edit/:id', async (req, res) => {
    const article = await Article.findById(req.params.id);
    res.render('articles/edit', { article: article })
});

router.get('/:slug', async (req, res) => {
    const article = await Article.findOne({ slug: req.params.slug });
    const comment = await Comments.find().sort({ createdAt: 'desc' });
    if (article == null) res.redirect('/');
    res.render('articles/show', { article: article, comments: comment });
});

router.get('/:slug/new/comment', async (req, res) => {
    const article = await Article.findOne({ slug: req.params.slug });
    const comment = await Comments.find().sort({ createdAt: 'desc' });
    res.render('articles/edit_comment', { article: article, comments: comment, comment: new Comments() })
});

// router.post("/:slug/comment", async (req, res)=> {
//     const article = await Article.findOne({ slug: req.params.slug });
//     console.log(article);
//     const comment = await Comments.find().sort({ createdAt: 'desc' });
//     console.log(comment);
//     console.log('every comments: ', comment);
//     let comments = new Comments({
//         writer: req.body.writer,
//         post: req.body.post,
//     });
//     console.log('new comment: ', comments);
//     try {
//         comments = await comments.save();
//         console.log(comments)
//     } catch (e) {
//         console.log(`catch error when saving comments: ${e}`);
//     };
//     res.render('articles/show', { article: article, comments: comment })
// })

// router.post('/:slug', async (req, res, next) => {
//     req.comments = new Comments();
//     next();
// }, saveCommentAndRedirect('show'));

router.post('/', async (req, res, next) => {
    req.article = new Article();
    next();
}, saveArticleAndRedirect('new'));

router.post('/:slug', async (req, res, next) => {
    const article = await Article.findOne({ slug: req.params.slug });
    const comments = await Comments.find().sort({ createdAt: 'desc' });
    let comment = new Comments({
        writer: req.body.writer,
        post: req.body.post
    });
    try {
        comment = await comment.save();
        res.redirect(`/articles/${article.id}`);
    } catch (err) {
        console.log(err);
        res.render(`articles/show`, { article: article, comments: comments });
    };
});

router.put('/:id', async (req, res, next) => {
    req.article = await Article.findById(req.params.id);
    next();
}, saveArticleAndRedirect('edit'));

router.delete('/:id', async (req, res) => {
    await Article.findByIdAndDelete(req.params.id);
    res.redirect('/');
});

// router.post('/comment/save', async (req, res, next) => {
//     req.article = new Article();
//     next();
// }, saveCommentAndRedirect());

router.post('/comment/save', (req, res) => {
    res.send(req.body.author)
})


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

// function saveCommentAndRedirect(path){
//     return async (req, res) => {
//         const article = await Article.findOne({ slug: req.params.slug });
//         const comments = await Comments.find().sort({ createdAt: 'desc' });
//         const comment = req.comments;
//         comment.writer = req.body.writer;
//         comment.post = req.body.post;
//         try {
//             await comment.save();
//             res.redirect('/articles/');
//         } catch (err) {
//             console.log(err);
//             res.render(`articles/${path}`, { article: article, comments: comments });
//         };
//     };
// }

module.exports = router;