var mysql = require('mysql');
var conn = mysql.createConnection({
    host     : '127.0.0.1',
    user     : 'root',
    password : '123456',
    database : 'o2',
});

conn.connect();

const sql = 'DELETE FROM topic WHERE id=?';
const params = [1];
conn.query(sql, params, function(err, res, fields){
  if (err) {
    console.log(err);
  } else {
    console.log(res);
  }
});

conn.end();