const express = require('express');
const mongoose = require('mongoose');
const Article = require('./models/article');
const Comments = require('./models/comment');
const User = require('./models/user');
const Categories = require('./models/category')
const articleRouter = require('./routes/articles');
const rootRouter = require('./routes/root')
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const session = require('express-session');
const jsdom = require('jsdom');
const user = require('./models/user');
const article = require('./models/article');
const FileStore = require('session-file-store')(session);

const app = express();
const databaseName = 'cluster0'
const url = 'mongodb+srv://chaeyun:zKNNyM0JBBVrMWjy@cluster0.hybtrew.mongodb.net/?retryWrites=true&w=majority'
const port = 5050;

const db = mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then( () => {
    console.log(`Connected to database : ${databaseName}`)
});

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(session({
    secret: '1234',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
    store: new FileStore(),
}));

app.get('/', async (req, res) => {
    // const articles = await Article.find().sort({ createdAt: 'desc' });
    const articles = await Article.find({ isDeleted : false }).sort({ createdAt: 'desc' });
    const category = await Categories.find();
    const user = await User.findOne({ username: req.session.username });
    let session = '';
    let userId = '';
    if(user) {
        session = req.session;
        userId = user._id.toString();
    };
    // console.log(articles)
    res.render('articles/index', { articles: articles, user : req.session.username, session : req.session, userid: userId, categories:category });
});

// 로그아웃 시 세션 삭제
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if(err){
            console.log(err);
            return res.status(500).send("<h1>500 ERROR! </h1>")
        }
        res.redirect("/login")
    })
});

app.use('/articles', articleRouter);
app.use('/', rootRouter);


app.listen(port, () => {
    console.log(`Connected to port : ${port}`)
  })