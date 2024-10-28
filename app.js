const express = require("express");
const http = require("http");
const path = require("path");
const logger = require("morgan");

// Create the express app
const app = express();

// Import the model functions to be used in the application 
const support = require("./models/model");

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
    request.ISBN = request.query.ISBN;
    request.quantity = request.query.quantity;
    next();
});

// 2. Validate that order information is valid
app.get("/order", function(request, response, next) {
    request.errors = support.validateOrder(request.ISBN, request.quantity);
    if (request.errors.length > 0) {
        next(new Error("validation"));
    } else {
        next();
    }
});

// 3. Compute price of the order
app.get("/order", function(request, response, next) {
    request.book = support.getBookByISBN(request.ISBN);
    request.bill = support.computeBill(request.book.price, request.quantity);
    next();
});

// 4. Display the order and total cost
app.get("/order", function(request, response) {
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.end('<html><body>Thank you for your order of ' + request.quantity + ' copies of <b>' + request.book.title + '</b>! At $' + request.book.price + ' per copy, your total bill is $' + request.bill.toFixed(2) + ' with tax.</body></html>');
});


// The order was invalid, send error message back to user
app.use("/order", function(err, request, response, next) {
    if (err.message.includes("validation")) {
        response.writeHead(200, {'Content-Type': 'text/html'});
        var message = "<html><body><p>The following errors were found:<ul>"
        for (let error of request.errors) {
            message += "<li>"+ error +"</li>";
        }    
        response.end(message+'</ul> Press the BACK button and try again!</p></body></html>');
    } else {
        next(err);
    }
});


// Request not handled by any previous gets, so send error page
app.use(function(request, response) {
    response.writeHead(404, {'Content-Type': 'text/html'});
    response.end('<html><body><h2>Sorry -- file not found!</h2></body></html>');
});

// Error was not handled, so send server error page as a last resort
app.use(function(err, request, response, next) {
    response.writeHead(500, {'Content-Type': 'text/html'});
    response.end('<html><body><h2>Server error!</h2></body></html>');
});

// Have the app listen on port 3000
http.createServer(app).listen(3000);
