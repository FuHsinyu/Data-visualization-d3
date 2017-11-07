//'use strict';
//please address http://localhost:8080/hw3.html on your browers
var
    fs = require('fs'),
    url = require('url'),
    path = require('path'),
    http = require('http');
// Creat server
var server = http.createServer(function (request, response) {
       var filepath = "../" + request.url;
    fs.stat(filepath, function (err, stats) {
        if (!err && stats.isFile()) {
            // 没有出错并且文件存在:
            console.log('200 ' + request.url);
            // 发送200响应:
            response.writeHead(200);
            // 将文件流导向response:
            fs.createReadStream(filepath).pipe(response);
        } else {
            // 出错了或者文件不存在:
            console.log('404 ' + request.url);
            // 发送404响应:
            response.writeHead(404);
            response.end('404 Not Found');
        }
    });
});

server.listen(8080);

console.log('Server is running at http://127.0.0.1:8080/');
console.log("please address http://localhost:8080/hw3.html on your browers")

