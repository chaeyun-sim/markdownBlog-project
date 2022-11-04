const express = require('express');
const Article = require('./../models/article');
const Comments = require('./../models/comment');
const router = express.Router();

// 참고 : https://4sii.tistory.com/16?category=792927


// router.get('/login', (req, res) => {   // 정상실행중
//     res.render('articles/login');
// });

// router.get('/register', (req, res) => {   // 아직안 만듬
//     res.render('articles/register', { articles: articles });
// });

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