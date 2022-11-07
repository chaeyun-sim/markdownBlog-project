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
})


// router.post('/login', (req, res) => {
//     let user = {
//         username: 'admin',
//         password: '1234',
//         nickname: 'Admin',
//     };
//     let uname = req.body.username;
//     let pwd = req.body.password;
//     if(uname === user.username && pwd === user.password){
//         req.session.nickname = user.nickname;
//         res.redirect('/mypage');
//     } else {
//         res.send(`<h1>THERE IS NO USER</h1>Go back to <a href="/login">Login</a>`);
//     }
// });

// router.get('/mypage', loginCheck, (req, res) => {
//     if(req.session.displayName) {
//         return res.send(`
//         <h1>Hello, ${req.session.displayName}</h1>
//         <a href="/logout">Logout</a>
//         `);
//     } else {
//         return res.send(`
//         <h1>Welcome Stranger!</h1>
//         <a href="/login">Login</a>
//         `)
//     }
// });

// router.get('/logout', (req, res) => {
//     delete req.session.displayName;  // 세션이 없어지는 와중에 redirection을 해서 발생하는 오류였다..
//     req.session.save(function(){  //data store의 저장이 끝났을 때 콜백함수를 나중에 호출한디.
//         res.redirect('/login');
//     });
// });


module.exports = router;