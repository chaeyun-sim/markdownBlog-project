const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();

const mysql = require('mysql');
const conn = mysql.createConnection({
    host     : '127.0.0.1',
    user     : 'root',
    password : '123456',
    database : 'o2',
});

conn.connect();

app.use(bodyParser.urlencoded({extended: false}));
app.locals.pretty = true;
app.set('views', './views_sql');
app.set('view engine', 'pug');
app.use(express.static('public'));

app.get('/topic/add', function(req, res){
    let sql = 'SELECT id, title FROM topic';
    conn.query(sql, function(err, topics, fields) {
        if(err){
            console.log(err);
            res.status(500).send('Internal Server Error')
        }
        res.render('add', {topics:topics});
    });
});
app.post('/topic/add', function(req, res){
    let title = req.body.title;
    let description = req.body.description;
    let author = req.body.author;
    let sql = 'INSERT INTO topic (title, description, author) VALUES (?, ?, ?)';
    conn.query(sql, [title, description, author], function(err, results, fields){
        if(err){
            console.log(err);
            res.status(500).send('Internal Server Error!.');
        } else {
            res.redirect('/topic/'+results.insertID);
        }
    });
});
app.get(['/topic', '/topic/:id'], function(req, res){
    let sql = 'SELECT id, title FROM topic';
    conn.query(sql, function(err, topics, fields) {
      var id = req.params.id;
      if(id){
        var sql = 'SELECT * FROM topic WHERE id=?';
        conn.query(sql, [id], function(err, topic, fields){
          if(err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
          } else {
            res.render('view', {topics:topics, topic:topic[0]});
          }
        });
      } else {
        res.render('view', {topics:topics});
      }
    });
});
app.get(['/topic/:id/edit'], function(req, res){
    let sql = 'SELECT id, title FROM topic';
    conn.query(sql, function(err, topics, fields) {
      var id = req.params.id;
      if(id){
        var sql = 'SELECT * FROM topic WHERE id=?';
        conn.query(sql, [id], function(err, topic, fields){
          if(err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
          } else {
            res.render('edit', {topics:topics, topic:topic[0]});
          }
        });
      } else {
        console.log('NO PAGE.');
        res.status(500).send('Internal Server Error');
      }
    });
});
app.post(['/topic/:id/edit'], function(req, res) {
    var title = req.body.title;
    var description = req.body.description;
    var author = req.body.author;
    var id = req.params.id;
  
    var sql = 'UPDATE topic SET title=?, description=?, author=? WHERE id=?';
    conn.query(sql, [title, description, author, id], function(err, result, fields) {
        if(err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
        } else {
            res.redirect('/topic/' + id);
        }
    });
});
app.get(['/topic/:id/delete'], function(req, res){
    let sql = 'SELECT id, title FROM topic';
    let id = req.params.id;
    conn.query(sql, function(err, topics, fields) {
        let sql = 'SELECT * FROM topic WHERE id=?';
        conn.query(sql, [id], function(err, topic){
            if(err) {
                console.log(err);
                res.status(500).send('Internal Server Error');
            } else {
                if(topic.length === 0) {
                    console.log(err);
                    res.status(500).send('There is no record.');
                } else {
                    res.render('delete', {topics:topics, topic:topic[0]});
                }
            };
        });
    });
});
app.post(['/topic/:id/delete'], function(req, res) {
    var id = req.params.id;
    var sql = 'DELETE FROM topic WHERE id=?';
    conn.query(sql, [id], function(err, result) {
        if(err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
        } else {
            res.redirect('/topic/');
        }
    });
});
app.post('/topic', function(req, res){
    const title = req.body.title;
    const description = req.body.description;
    fs.writeFile('data_sql/' + title, description, function(err){
        if(err){
            res.status(500).send('Internal Server Error!.');
        }
        res.redirect('/topic/'+title);
    });
});
app.listen(3000, function() {
    console.log('---- Connected to 3000 port')
});
