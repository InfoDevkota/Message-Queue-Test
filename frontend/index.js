const http = require('http');
const fs = require('fs');

const socket = require("socket.io")

let server = http.createServer((req, res) => {
    if (req.url == "/") {
        return handelHomepage(req, res);
    }
})

let handelHomepage = (req, res) => {
    // console.log("In home");
    return serveStatic("/view/index.html", res);
}

/**
 * serve a file
 * @param {string} file file path
 * @param {Object} res response from createServer
 */
let serveStatic = (file, res) => {
    fs.readFile(__dirname + file, function (err, data) {
        if (err) {
            res.writeHead(404);
            res.end(JSON.stringify(err));
            return;
        }
        res.writeHead(200);
        res.end(data);
    });
}

let io = socket(server); //just to get the /socket.io/socket.io.js
server.listen(8082);
console.log("frontend listining at 8080");
