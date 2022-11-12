const express = require('express');
const Article = require('./../models/article');
const Comments = require('./../models/comment');
const bodyParser = require('body-parser');
const router = express.Router();
const randomid = require('randomid');
const { updateOne } = require('./../models/article');
const comment = require('./../models/comment');

// 새 아티클 저장 페이지
router.get('/new', (req, res) => {
    res.render('articles/new', { article: new Article() })
});

// 아티클의 수정페이지
router.get('/edit/:id', async (req, res) => {
    const article = await Article.findById(req.params.id);
    res.render('articles/edit', { article: article })
});

// 아티클 페이지
router.get('/:slug', async (req, res) => {
    const article = await Article.findOne({ slug: req.params.slug });
    const comments = await Comments.find({ parentTitle: article.title, isDeleted : false }).sort({ createdAt: 'asc' });
    console.log(comments)
    if (article == null) res.redirect('/');
    res.render('articles/show', { article: article, comments: comments, length: Object.keys(comments).length, comment: new Comments() });
});

// 메인 페이지
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

// 댓글 추가
router.post('/:slug/comment', async (req, res) => {
    const article = await Article.findOne({ slug: req.params.slug });
    const comment = new Comments({
        parentTitle: article.title,
        writer: req.body.writer,
        post: req.body.post,
        isDeleted: false,
        slug: randomid(17),
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

// 댓글 수정 페이지
router.get('/:slug/:id', async (req, res) => {
    const article = await Article.findOne({ slug: req.params.slug });
    const comments = await Comments.find({ parentTitle: article.title, isDeleted : false }).sort({ createdAt: 'asc' });
    const comment = await Comments.findOne({ _id: req.params.id });
    res.render('articles/edit_comments', { article: article, comments: comments, this_comment: comment, length: Object.keys(comments).length })
});

// 댓글 수정
router.put('/:slug/:id', async (req, res) => {
    const article = await Article.findOne({ slug: req.params.slug });
    await Comments.findByIdAndUpdate(
        req.params.id,
        {
            writer: req.body.writer,
            post: req.body.post,
        },
    )
    res.status(301).redirect(`/articles/${article.slug}`);
})

// 댓글 삭제
router.get('/:slug/del/:id', async (req, res) => {
    const article = await Article.findOne({ slug: req.params.slug });
    const comments = await Comments.find({ _id: req.params.id });
    comments.forEach(comment => {
        try {
            comment.isDeleted = true;
            comment.save();
            console.log("deleted!");
        } catch (err){
            console.log(`catched error when deleting comments : ${err}`)
        }
        res.status(301).redirect(`/articles/${article.slug}`);
    })
});

function saveArticleAndRedirect(path) {
    return async (req, res) => {
        let article = req.article;
        article.title = req.body.title;
        article.description = req.body.description;
        article.markdown = req.body.markdown;
        article.isDeleted = false;
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