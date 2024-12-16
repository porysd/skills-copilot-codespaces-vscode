// Create web server that will accept incoming comments and store them in a
// file. The server should respond with the list of comments it has collected
// so far when it receives a GET request to the comments path.

var http = require('http');
var fs = require('fs');
var path = require('path');
var url = require('url');

var commentsFile = path.join(__dirname, 'comments.json');

var server = http.createServer(function(req, res) {
  if (req.method === 'GET' && req.url === '/comments') {
    fs.readFile(commentsFile, function(err, data) {
      if (err) return console.error(err);
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.end(data);
    });
  } else if (req.method === 'POST' && req.url === '/comments') {
    var body = '';
    req.on('data', function(chunk) {
      body += chunk;
    });
    req.on('end', function() {
      fs.readFile(commentsFile, function(err, data) {
        if (err) return console.error(err);
        var comments = JSON.parse(data);
        comments.push(JSON.parse(body));
        fs.writeFile(commentsFile, JSON.stringify(comments), function(err) {
          if (err) return console.error(err);
          res.writeHead(200, {'Content-Type': 'application/json'});
          res.end(JSON.stringify(comments));
        });
      });
    });
  } else {
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.end('Not Found');
  }
});

server.listen(3000, function() {
  console.log('Server listening on port 3000');
});erver