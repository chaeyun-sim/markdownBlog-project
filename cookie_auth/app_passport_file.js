var express = require('express');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var bodyParser = require('body-parser');
const bkfd2Password = require("pbkdf2-password");
const hasher = bkfd2Password();
const assert = require('assert');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { options } = require('sanitize-html');

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: '1234DSFs@adf1234!@#$asd',
    resave: false,
    saveUninitialized: true,
    store:new FileStore()
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/count', function(req, res){
    if(req.session.count) {
        req.session.count++;
    } else {
        req.session.count = 1;
    }
    res.send('count : '+req.session.count);
});

app.get('/auth/logout', (req, res) => {
    delete req.session.displayName;
    req.session.save(function(){
        res.redirect('/auth/login');
    });
});

app.get('/welcome', function(req, res){
    if(req.session.displayName) {
        res.send(`
        <h1>Hello, ${req.session.displayName}</h1>
        <a href="/auth/logout">logout</a>
        `);
    } else {
        res.send(`
        <h1>Welcome</h1>
        <ul>
            <li><a href="/auth/login">Login</a></li>
            <li><a href="/auth/register">Register</a></li>
        </ul>
        `);
    }
});

// passport.serializeUser((user, done) => {
//     console.log('serializeUser', user);
//     done(null, user.username);
// });

// passport.deserializeUser((id, done) => {
//     console.log('deseriallizeUser', id);
//     for(var i=0;i<users.length; i++){
//         var user = users[i];
//         if(user.username === id){
//             done(null, user);
//         }
//     };
// });

// passport.use(new LocalStrategy(
//     function(username, password, done) {
//     var uname = username;
//     var pwd = password;
//     for(var i=0; i<users.length; i++){
//         var user = users[i];
//         if(uname === user.username) {
//             return hasher({password:pwd, salt:user.salt}, function(err, pass, salt, hash){
//             if(hash === user.password){
//                 console.log('LocalStrategy', user);
//                 done(null, user);   //null은 에러처리
//             } else {
//                 done(null, false);
//             }
//             });
//         }
//     }
//     done(null, false);
//     }
// ));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

var authData = {
    username: 'egoing',
    password: '111111',
    nickname: 'Egoing'
}

passport.use(new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'pwd'
     },
     function (username, password, done) {
       console.log('LocalStrategy', username, password);
       if(username === authData.username){
         console.log(1);
         if(password === authData.password){
           console.log(2);
           return done(null, authData);
         } else {
           console.log(3);
           return done(null, false, {
             message: 'Incorrect password.'
           });
         }
       } else {
         console.log(4);
         return done(null, false, {
           message: 'Incorrect username.'
         });
       }
     }
));

// app.post('/auth/login', passport.authenticate('local', { 
//     successRedirect: '/welcome',
//     failureRedirect: '/auth/login',
//     failureFlash: false,  //다른 페이지로 보낼때 인증에 실패했다는 정보를 딱 한번만 줌(true)
// }));

app.post('/auth/login',
   passport.authenticate('local', {
     successRedirect: '/welcome',
     failureRedirect: '/auth/login'
}));

// var users = [
//   {
//     username:'egoing',   //id나 username이 식별자
//     // password:'jSKliUnTU10bSqdbmy6p6HX1C0tsDtO0L1JsfoQ767KmCSJH734omyHTBb9FsQhnaEkWyCSfMHdDZ5yyeLztHeIBLQnFszf7wMD/mUij/ccmKo4JeYJmiMRGj81UbJEAnz+qWuVL2TVhDCRB8P2YVIvY0lrsxLpsh5mpR0ChjII=',
//     password: 111,
//     // salt:'d4x/0nAVSBSnmDsQ8vGDg8eRYItcVM33UUO3nx0ZBmdu5CyZKXpjG3qggt4hqR9eQo/pkXlbOnQ8rk1LtYT3ig==',
//     displayName:'Egoing'
//   }
// ];

app.post('/auth/register', function(req, res){
    hasher({password:req.body.password}, function(err, pass, salt, hash){
        var user = {
            username:req.body.username,
            password:hash,
            salt:salt,
            displayName:req.body.displayName
        };
        users.push(user);
        req.session.displayName = req.body.displayName;
        req.session.save(function(){
            console.log(req.session);
            res.redirect('/welcome');
        });
    });
});

app.get('/auth/register', function(req, res){
    var output = `
    <h1>Register</h1>
    <form action="/auth/register" method="post">
        <p>
            <input type="text" name="username" placeholder="username">
        </p>
        <p>
            <input type="password" name="password" placeholder="password">
        </p>
        <p>
            <input type="text" name="displayName" placeholder="displayName">
        </p>
        <p>
            <input type="submit">
        </p>
    </form>
    `;
    res.send(output);
});

app.get('/auth/login', function(req, res){
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
        <a href="/auth/register">Sign up</a>
    </form>
    `;
    res.send(output);
});

app.listen(3003, function(){
    console.log('Connected 3003 port!!!');
});