const express = require('express');
const mongoose = require('mongoose');
const Article = require('./models/article');
const articleRouter = require('./routes/articles');
const methodOverride = require('method-override');
const app = express();
const databaseName = 'cluster0'
const url = `mongodb+srv://chaeyun:zKNNyM0JBBVrMWjy@${databaseName}.hybtrew.mongodb.net/${databaseName}?retryWrites=true&w=majority`
const port = 3000;

const db = mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then( () => {
    console.log(`Connected to database : ${databaseName}`)
});

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));

app.get('/', async (req, res) => {
    const articles = await Article.find().sort({ createdAt: 'desc' });
    res.render('articles/index', { articles: articles });
});

app.use('/articles', articleRouter);

app.listen(port, () => {
    console.log(`Connected to port : ${port}`)
  })