const express = require('express');
const article = require('./../models/article');
const Article = require('./../models/article');
const Comments = require('./../models/comment');
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
    // const comments = await Comments.findOne({ post: req.params.post });
    const comment = await Comments.find().sort({ createdAt: 'desc' });
    if (article == null) res.redirect('/');
    res.render('articles/show', { article: article, comments: comment });
});

router.get('/:slug/new/comment', async (req, res) => {
    const article = await Article.findOne({ slug: req.params.slug });
    const comment = await Comments.find().sort({ createdAt: 'desc' });
    res.render('articles/edit_comment', { article: article, comments: comment, comment: new Comments() })
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

// router.post('/comment/save', async (req, res, next) => {
//     req.article = new Article();
//     next();
// }, saveCommentAndRedirect());

router.post('/comment/save', (req, res) => {
    res.send(req.author)
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
//         let article = req.article;
//         let comment = req.comment;
//         try {
//             await comment.save();
//             res.redirect('/articles/' + article.slug);
//         } catch (e) {
//             console.log(e);
//             res.render('/', { article: article, comment: comment });
//         }
//     }
// }

module.exports = router;