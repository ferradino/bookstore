const express = require("express");
const http = require("http");
const path = require("path");
const logger = require("morgan");

// Create the express app
const app = express();

// Get path to page files used in this app (regardless of OS)
// Store as a static variable in Express
const pagesPath = path.resolve(__dirname, "pages");
app.use(express.static(pagesPath));

// Create a logger for request sent to the app
app.use("/", logger("short"));

// Order form page at "/"
app.get("/", function(request, response) {
    response.sendFile("index.html", {root: pagesPath});
});

// Recieved an order at "/order"
// 1. Parse order information, create entity object for order
app.get("/order", function(request, response, next) {
    next();
});

// 2. Validate that order information is valid
app.get("/order", function(request, response, next) {
    next();
});

// 3. Compute price of the order
app.get("/order", function(request, response, next) {
    next();
});

// 4. Display the order and total cost
app.get("/order", function(request, response) {
});


// The order was invalid, send error message back to user
app.use("/order", function(err, request, response, next) {
});

// Request not handled by any previous gets, so send error page
app.use(function(request, response) {
    response.writeHead(404, {'Content-Type': 'text/html'});
    response.end('<html><body><h2>Sorry -- file not found!</h2></body></html>');
});

// Error was not handled, so send server error page as a last resort
app.use(function(err, request, response, next) {
    console.log(err);
    response.writeHead(500, {'Content-Type': 'text/html'});
    response.end('<html><body><h2>Server error!</h2></body></html>');
});

// Have the app listen on port 3000
http.createServer(app).listen(3000);
