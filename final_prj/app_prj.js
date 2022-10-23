// supervisor 실행 예시
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.locals.pretty = true;
app.set('views', './views_prj');
app.set('view engine', 'pug');

app.get('/topic/new', function(req, res){
    fs.readdir('data', function(err, files){
        if(err){
            console.log(err);
            res.status(500).send('Internal Server Error!.');
        }
        res.render('new', {
            topics:files
        });
    });
});
app.post('/topic', function(req, res){
    const title = req.body.title;
    const description = req.body.description;
    fs.writeFile('data/' + title, description, function(err){
        if(err){
            res.status(500).send('Internal Server Error!.');
        } // ex 아무것도 쓰지 않고 제출을 누른다면
        res.redirect('/topic/'+title); // 새로 작성한 데이터 페이지로 바로 넘어감
    });
});
app.get(['/topic', '/topic/:id'], function(req, res){
    fs.readdir('data', function(err, files){
        if(err){
            console.log(err);
            res.status(500).send('Internal Server Error!.');
        } // 이부분은 topic이나 topic:id나 같이 실행됨
        const id = req.params.id;
        if(id) {
            // id값이 있을 때
            fs.readFile('data/'+id, 'utf8', function(err, data){
                if(err){
                    console.log(err);
                    res.status(500).send('Internal Server Error!');
                }
                res.render('view', {
                    topics:files,
                    title:id,
                    description: data,
                });
            });
        } else {
            // id 값이 없을 때
            res.render('view', {
                topics:files,
                title:'Welcome',
                description:'Hello, JavaScript for Server!'
            });
        }
    });
});
app.listen(3000, function() {
    console.log('---- Connected to 3000 port')
});
