var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.locals.pretty = true;
app.set('view engine', 'pug');
app.set('views', './views');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));

// app.get('/topic', function(req, res){
//     var topics =[
//         'Javascript is ...',
//         'Nodejs is ...',
//         'Express is ...'
//     ];
//     var output = `
//         <a href='/topic?id=0'>Javascript</a><br>
//         <a href='/topic?id=1'>Nodejs</a><br>
//         <a href='/topic?id=2'>Express</a><br><br>
//         ${topics[req.query.id]}
//     `
//     res.send(output);
// })
app.get('/form', function(req, res){
    res.render('form');
  });
app.post('/form_receiver', function(req, res){
    var title = req.body.title;
    var description = req.body.description;
    res.send(title+','+description);
});
app.get('/topic/', function(req, res){
    var topics =[
        'Javascript is ...',
        'Nodejs is ...',
        'Express is ...'
    ];
    var output = `
        <a href='/topic?id=0'>Javascript</a><br>
        <a href='/topic?id=1'>Nodejs</a><br>
        <a href='/topic?id=2'>Express</a><br><br>
        ${topics[req.query.id]}
    `
    res.send(output);
})
app.get('/topic/:id/:mode', function(req, res){
    res.send(req.params.id + ',' + req.params.mode)
})
app.get('/param/:module_id/:topic_id', function(req, res) {
    res.json(req.params);
})
app.get('/template', function(req, res) {
    res.render('temp', {
        time:Date(),
        _title:'Jade'
    });
})
app.get('/', function(req, res){
    res.send('Hello! This is my homepage!');
});
app.get('/dynamic', function(req, res) {
    var time = Date();
    var lis = '';
    for (var i=0; i<5; i++){
        lis = lis + '<li>coding</li>'
    }
    var output = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title></title>
    </head>
    <body>
        <h1>Hello, Static!!</h1>
        <p><strong>Current time: </strong>${time}</p>
        <ul>
            ${lis}
        </ul>
    </body>
    </html>
    `
    res.send(output)
});
app.get('/image', function(req, res) {
    res.send('Hello Image, <img src="/cloud.png">')
});
app.get('/login', function(req, res){
    res.send('<h1>Login please</h1>');
});
app.listen(3000, function(){
    console.log('Connected 3000 port!');
});