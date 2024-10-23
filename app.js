const express = require("express");
const http = require("http");
const logger = require("morgan");

// Create the express app
const app = express();

app.use("/", logger("short"));

// Home page at "/"
app.get("/", function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end('<html><body><h2>Hello, World!</h2></body></html>');
});

// Have the app listen on port 3000
http.createServer(app).listen(3000);


