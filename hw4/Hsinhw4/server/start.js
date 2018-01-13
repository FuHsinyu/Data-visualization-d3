'use strict';
const http = require('http');
var fs = require("fs");
var path = require('path');

var extensions = {
  ".html" : "text/html",
  ".css" : "text/css",
  ".csv" : "text/csv",
  ".json" : "text/json",
  ".js" : "application/javascript",
  ".png" : "image/png",
  ".gif" : "image/gif",
  ".jpg" : "image/jpeg",
  ".ttf" : "application/octet-stream",
  ".otf" : "application/octet-stream"
};

http.createServer(function(requset, response) {
  var filePathNotFound = true;
  var requestPath = null;

  if (requset.url) {
    requestPath = '../' + requset.url;
    if (fs.existsSync(requestPath) && extensions[path.extname(requset.url)]) {
      filePathNotFound = false;

      fs.readFile(requestPath, function(err, data) {
        response.writeHead(200, {
          'Content-Type': extensions[path.extname(requset.url)]
          // 'Access-Control-Allow-Origin': '*'
        });
        response.write(data);
        response.end();
      });
    }
  }
  if (filePathNotFound) {
    response.writeHead(404, {'Content-Type': 'text/plain'});;
    response.write('404 ERROR: Path "' + (requestPath ? requestPath : '') + '" is not exists or not supported.')
    response.end();
  }
}).listen(8080);
console.log('Server running on 8080');
