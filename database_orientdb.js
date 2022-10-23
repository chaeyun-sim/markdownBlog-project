// orientdb practice

const OrientDBClient = require("orientjs").OrientDBClient;

OrientDBClient.connect({
  host: "localhost",
  port: 2424
}).then(client => {
    client.session({ name: "o2", username: "root", password: "1234" }) .then(session => {
	    return session.close();
    });
}).then(()=> {
   console.log("Client closed");
});

var sql = 'SELECT FROM topic';
db.query(sql).then(function(results){
    console.log(results);
});


var sql = 'SELECT FROM topic WHERE @rid=:rid';
var param = {
    params: {
        rid: '#58:0'
    }
}


var sql = "INSERT INTO topic (title, description) VALUES(:title, :desc)";
var _param = {
    params:{
        title:"Express",
	    desc:"Express is framework for web",
    }
}
db.query(sql, _param).then(function(results){
    console.log(results);
});
