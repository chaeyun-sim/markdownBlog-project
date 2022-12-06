const express = require('express');
const Article = require('./../models/article');
const Comments = require('./../models/comment');
const User = require('./../models/user')
const Categories = require('./../models/category')
const bodyParser = require('body-parser');
const router = express.Router();
const randomid = require('randomid');
const session = require('express-session');
const jsdom = require('jsdom');
const comment = require('./../models/comment');
const category = require('./../models/category');

// 새 아티클 저장 페이지
router.get('/new', async (req, res) => {
    const user = await User.findOne({ username: req.session.username });
    const category = await Categories.find();
    let sessions = '';
    let userId = '';
    if(user) {
        sessions = req.session.username;
        userId = user._id.toString();
    };
    res.render('articles/new', { article: new Article(), session: sessions, userid : userId, categories : category })
});

// 아티클의 수정페이지
router.get('/edit/:id', async (req, res) => {
    const article = await Article.findById(req.params.id);
    const user = await User.findOne({ username: req.session.username });
    const category = await Categories.find();
    let session = '';
    let userId = '';
    if(user) {
        session = req.session;
        userId = user._id.toString();
    };
    res.render('articles/edit', { article: article, session: session, userid : userId, categories : category })
});

// 새 아티클 추가
router.post('/', async (req, res, next) => {
    req.article = new Article();
    next();
}, saveArticleAndRedirect('new'));

// 아티클 수정
router.put('/:id', async (req, res, next) => {
    req.article = await Article.findById(req.params.id);
    next();
}, saveArticleAndRedirect('edit'));

// 아티클과 댓글 삭제
router.delete('/:id', async (req, res) => {
    const article = await Article.findById( req.params.id );
    const comments = await Comments.find({ parentTitle: article.title })
    try {
        article.isDeleted = true;
        article.save();
        comments.forEach(comment => {
            comment.isDeleted = true;
            comment.save();
            console
            .log("deleted!");
        });
        res.status(301).redirect('/');
    } catch (err){
        console.log(`catched error when deleting article : ${err}`)
    }
});

// 아티클 페이지
router.get('/:slug', async (req, res) => {
    const article = await Article.findOne({ slug: req.params.slug });
    const comments = await Comments.find({ parentTitle: article.title, isDeleted : false }).sort({ createdAt: 'asc' }); 
    const category = await Categories.find()
    const user = await User.findOne({ username: req.session.username });
    let previous = await Article.findOne({ indexNum: article.indexNum - 1 });
    let next = await Article.findOne({ indexNum: article.indexNum + 1})
    let session = '';
    let userId = '';
    let cate = '';
    if(!previous) {
        previous = '';
    }
    if(!next){
        next = '';
    }
    if(user) {
        session = req.session;
        userId = user._id.toString();
    }
    for (let i = 0; i < category.length; i++){
        if (category[i].name == article.category) {
            cate = category[i];
            console.log(cate)
        }
    }
    if (article == null) res.redirect('/');
    res.render('articles/show', { article: article, comments: comments, length: Object.keys(comments).length, user : req.session.username, comment: new Comments(), session: session, userid : userId, previous: previous, next: next, cate:cate });
});

// 댓글 추가
router.post('/:slug/comment', async (req, res) => {
    const article = await Article.findOne({ slug: req.params.slug });
    const comment = new Comments({
        parentTitle: article.title,
        writer: req.session.username,
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
    const user = await User.findOne({ username: req.session.username });
    let session = '';
    let userId = '';
    if(user) {
        session = req.session;
        userId = user._id.toString();
    }
    let previous = await Article.findOne({ indexNum: article.indexNum - 1 });
    let next = await Article.findOne({ indexNum: article.indexNum + 1})
    if(!previous) {
        previous = '';
    }
    if(!next){
        next = '';
    }
    res.render('comments/edit_comments', { article: article, comments: comments, this_comment: comment, length: Object.keys(comments).length, session: session, userid : userId, previous: previous, next: next  })
});

// 댓글 수정
router.put('/:slug/:id', async (req, res) => {
    const article = await Article.findOne({ slug: req.params.slug });
    await Comments.findByIdAndUpdate(
        req.params.id,
        {
            post: req.body.post,
            isUpdated: true,
        },
    )
    res.status(301).redirect(`/articles/${article.slug}`);
})

// 댓글 직접 삭제
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
        const articles = await Article.find().sort({ createdAt: 'desc' });
        const totalAricles = Object.keys(articles).length;
        let article = req.article;
        article.title = req.body.title;
        article.description = req.body.description;
        article.markdown = req.body.markdown;
        article.writer = req.session.username;
        article.isDeleted = false;
        article.isUpdated = false;
        article.indexNum = totalAricles + 1;
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