const express = require('express');
// import express from express;
const mongoose = require('mongoose');
const Article = require('./models/article');
const Comments = require('./models/comment');
const articleRouter = require('./routes/articles');
const rootRouter = require('./routes/root')
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
// const passport = require('passport');
// const LocalStrategy = require('passport-local').Strategy;
// const flash = require('connect-flash');
// const session = require('express-session');

const app = express();
const databaseName = 'cluster0'
const url = 'mongodb+srv://chaeyun:zKNNyM0JBBVrMWjy@cluster0.hybtrew.mongodb.net/?retryWrites=true&w=majority'
const port = 5050;

const db = mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then( () => {
    console.log(`Connected to database : ${databaseName}`)
});

app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));

app.get('/', async (req, res) => {
    const articles = await Article.find().sort({ createdAt: 'desc' });
    res.render('articles/index', { articles: articles });
});

app.use('/articles', articleRouter);
app.use('/', rootRouter);


app.listen(port, () => {
    console.log(`Connected to port : ${port}`)
  })