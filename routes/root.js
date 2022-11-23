const express = require('express');
const Article = require('./../models/article');
const Comments = require('./../models/comment');
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
    console.log(req.body.username);
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
                console.log(req.session);
                res.redirect('/profile/'+ userInfo.id);
            })
        }
    } else {
        res.write("<script>alert('Please check your username and password again.');location.href='/login';</script>");
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


module.exports = router;