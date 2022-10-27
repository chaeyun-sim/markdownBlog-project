const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: false}));
app.use(session({ // 세션 세팅
    secret: '1234DSFs@adf1296!@#aSdQx',
    resave: false,
    saveUninitialized: true,
}));

app.get('/count', (req, res) => {
    if(req.session.count){  // 카운트의 값이 세팅되어있지 않은 경우에 false
        req.session.count++;
    } else {
        req.session.count = 1;
    }
    res.send('count : ' + req.session.count); // 새창으로 이 브라우저를 켜거나 서버 연결을 끊었다가 다시 연결하면 다시 1로 돌아간다 (새로운 세션)
});

app.get('/tmp', (req, res) => {
    res.send('result : ' + req.session.count)
});

app.get('/auth/login', (req, res) => {
    var output = `
    <h1>Login</h1>
    <form action="/auth/login" method="post">
        <p>
            <input type="text" name="username" placeholder="username">
        </p>
        <p>
            <input type="password" name="password" placeholder="password">
        </p>
        <p>
            <input type="submit">
        </p>
    </form>
    `;
    res.send(output);
});

app.get('/auth/logout', (req, res) => {
    delete req.session.displayName;  // 세션 삭제
    res.redirect('/welcome');
})

app.get('/welcome', (req, res) => {
    if(req.session.displayName) {
        res.send(`
        <h1>Hello, ${req.session.displayName}</h1>
        <a href="/auth/logout">Logout</a>
        `);
    } else {
        res.send(`
        <h1>Welcome Stranger!</h1>
        <a href="/auth/login">Click to</a>
        `)
    }
});

app.post('/auth/login', (req, res) => {
    let user = {
        username: 'egoing',
        password: '111',
        displayName: 'Egoing',
    };
    let uname = req.body.username;
    let pwd = req.body.password;
    if(uname === user.username && pwd === user.password){
        req.session.displayName = user.displayName
        res.redirect('/welcome')
    } else {
        res.send(`<h1>THERE IS NO USER</h1><a href="/auth/login">Back to login</a>`)
    }
    res.send(uname);
});

app.listen(3003, () => {
    console.log('Connected to port 3003')
});