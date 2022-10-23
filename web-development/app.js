const http = require('http');

function handelRequest(request, response) {
    if (request.url === '/currenttime') {
        response.statusCode = 200;
        response.end('<h1>' + new Date().toISOString() + '</h1>');
    } else if (request.url === '/') {
        response.statusCode = 200;
        response.end('<h1>Hello World!</h1>');
    }
};

const server = http.createServer(handelRequest);

server.listen(8000);
