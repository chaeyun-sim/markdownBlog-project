const express = require('express');
const Article = require('./../models/article');
const Comments = require('./../models/comment');
const Categories = require('./../models/category')
const User = require('./../models/user');
const router = express.Router();
const jsdom = require('jsdom')

// 로그인 페이지
router.get('/login', async (req, res) => {
    const users = await User.find().sort({ username: 'desc' });
    const user = await User.findOne({ username: req.session.username });
    let session = '';
    let userId = '';
    if(user) {
        session = req.session;
        userId = user._id.toString();
    };
    res.render('articles/login', { user: users, session: session, userid : userId })
});

// 회원가입 페이지
router.get('/register', async (req, res) => {
    const user = await User.findOne({ username: req.session.username });
    let session = '';
    let userId = '';
    if(user) {
        session = req.session;
        userId = user._id.toString();
    };
    res.render('articles/register', { user: new User(), session: session, userid : userId })
});

// 개인 페이지
router.get('/profile/:id', async (req, res) => {
    const userInfo = await User.findById(req.params.id);
    if(!req.session.username){
        res.send('<h1 class="text-align">Login Please.</h1><div class="text-align"><a href="/login" class="btn btn-primary">Back to LOGIN</a></div>')
    }
    const user = await User.findOne({ username: req.session.username });
    let session = '';
    let userId = '';
    if(user) {
        session = req.session;
        userId = user._id.toString();
    };
    res.render('articles/profile', { user: req.session.username, session: session, userid : userId })
})

// 회원가입 시 데이터 저장
router.post('/register', async (req, res) => {
    const user = new User({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        gender: req.body.gender,
    });
    try {
        await user.save();
        res.redirect('/login');
    } catch (e) {
        console.log(`catch error when saving info: ${e}`);
        res.render('/register');
    };
});

// 로그인 시 데이터 확인
router.post('/login', async (req, res) => {
    const userInfo = await User.findOne({ username: req.body.username });
    if(userInfo){
        if(userInfo.password == req.body.password){
            req.session.username = req.body.username;
            req.session.logined = true;
            req.session.save(() => {
                res.redirect('/');
            })
        }
    } else {
        res.render('articles/no_user');
    }
});

// 검색 기능
router.get('/article/search', async (req, res) => {
    const user = await User.findOne({ username: req.session.username });
    const { value } = req.query;
    let searchWord = [];
    if(value){
        searchWord = await Article.find({
            title: {
                $regex: new RegExp(`${value}`, "i"),
            }
        })
    };
    let session = '';
    let userId = '';
    if(user) {
        session = req.session;
        userId = user._id.toString();
    }
    res.render('articles/search', { articles: searchWord, session: session, userid : userId });
});

router.get('/article/add/categories', async (req, res) => {
    const category = await Categories.find();
    const user = await User.findOne({ username: req.session.username });
    let session = '';
    let userId = '';
    if(user) {
        session = req.session;
        userId = user._id.toString();
    };
    res.render('articles/add_categories', { category : new Categories(), session: session, userid : userId })
});


router.post('/article/add/categories', async (req, res) => {
    // console.log(req.body.name)
    // console.log(req.body.description)
    const category = new Categories({
        name: req.body.name,
        description: req.body.description,
    });
    try {
        await category.save();
        res.redirect('/');
    } catch (e) {
        console.log(`catch error when saving categories: ${e}`);
        res.redirect('/');
    };
});

router.get('/category/:id', async (req, res) => {
    const categories = await Categories.find()
    const category = await Categories.findById( req.params.id );
    console.log(category.name)
    const articles = await Article.find({ isDeleted : false, category: category.name }).sort({ createdAt: 'desc' });
    const user = await User.findOne({ username: req.session.username });
    let session = '';
    let userId = '';
    if(user) {
        session = req.session;
        userId = user._id.toString();
    };
    res.render('articles/index', { articles: articles, categories: categories, session: req.session, userid: userId })
})


module.exports = router;