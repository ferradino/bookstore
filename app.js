const express = require("express");
const path = require("path");
const http = require("http");
const logger = require("morgan");

// Construct the express object for this app
const app = express();

// Get path to pages (regardless of OS) and store it as a static variable in Express
const pagesPath= path.resolve(__dirname, 'Pages');
app.use(express.static(pagesPath));

// Use external logger middleware to display information about request
app.use("/", logger('short'));

// "Home Page" was requested
// Send user to "Selection Page" at "/index.html"
app.get("/", function(request, response) {
    response.sendFile("/index.html", { root : pagesPath });
});

// A product was selected by the user
// Send user to the corresponding product page
app.get("/select/:productID", function(request, response, next) {
    request.params.productID
    var productPage= request.params.productID + ".html";
    response.sendFile(productPage, { root : pagesPath }, function(err) {
        if (err) { // If no such book, begin error routing
            next(new Error("no such book"));
        }
    });
});

// First error handling routine logs error 
app.use("/select", function(err, request, response, next) {
    console.log(err);
    next(err); // Create new error specific to problem
});

// Next error handling routine sends back error message (and halts) if file error
app.use("/select", function(err, request, response, next) {
    if (err.message.includes("no such book")) {
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.end("<html><body><h2>No Such Book!</h2></body></html>");
    }
    else {
        next(err); // If this was not the error, route to the next handler
    }
});

// If reach here, request not handled by any previous gets, so send error page
app.use(function(request, response) {
    response.writeHead(404, {'Content-Type': 'text/html'});
    response.end('<html><body><h2>File Not Found!</h2></body></html>');
});

// If reach here, an unhandled error occured somewhere
app.use(function(err, request, response, next) {
    console.log(err);
    response.writeHead(500, {'Content-Type': 'text/html'});
    response.end('<html><body><h2>Server error!</h2></body></html>');
});

// Host application on port 3000
http.createServer(app).listen(3000);
