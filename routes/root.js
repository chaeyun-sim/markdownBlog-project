const express = require('express');
const Article = require('./../models/article');
const Comments = require('./../models/comment');
const User = require('./../models/user')
const router = express.Router();

// 참고 : https://4sii.tistory.com/16?category=792927

router.get('/login', async (req, res) => {
    const user = await User.find().sort({ username: 'desc' });
    res.render('articles/login', { user: user })
});

router.get('/register', (req, res) => {
    res.render('articles/register', { user: new User() })
});

router.get('/profile/:id', async (req, res) => {
    const userInfo = await User.findById(req.params.id);
    res.render('articles/profile')
})

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

router.post('/login', async (req, res) => {
    const userInfo = await User.findOne({ username: req.body.username });
    if(userInfo){
        if(userInfo.password == req.body.password){
            res.redirect('/profile/'+userInfo.id)
        } else{
            res.write("<script>alert('아이디 혹은 비밀번호를 다시 확인하세요.)'</script>");
            res.redirect('/login')
        }
    } else {
        res.render('articles/no_user')
    }
});

router.get('/search', async (req, res) => {
    const article = await Article.find({ title: req.query.value});
    res.send(req.query.value)
    // res.render('search.ejs')
})


module.exports = router;