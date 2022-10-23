var fs = require('fs');

console.log("Sync code:");
var data = fs.readFileSync('./data.txt', {encoding: 'utf-8'});
console.log(data);

console.log("")

console.log("Async code:");
fs.readFile('./data.txt', {encoding: 'utf-8'}, function (err, data) {
    console.log(data);
});