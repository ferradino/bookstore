const express = require("express");
const http = require("http");
const logger = require("morgan");
const exphbs = require("express-handlebars");

// Create the express app
const app = express();

// Set up Handlebars
var handlebars = exphbs.create({defaultLayout: 'main'});
app.engine('.handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.use(express.static('views'));

// Import the model functions to be used in the application 
const support = require("./models/model");

// Create a logger for request sent to the app
app.use("/", logger("short"));

// Booklist page at "/"
app.get("/", function(request, response) {
    response.render("booklist", {booklist: support.getBookList()});
});

// Order page at "/orderform"
app.get("/orderform", function(request, response) {
    response.render("orderform", {booklist: support.getBookList()});
});

// Recieved an order at "/order"
// 1. Parse order information, create entity object for order
app.get("/order", function(request, response, next) {
    request.order = support.createOrder(request.query.ISBN, request.query.quantity);
    next();
});

// 2. Validate that order information is valid
app.get("/order", function(request, response, next) {
    // Find errors in order if they exist
    var errors = support.validateOrder(request.order);
    if (Object.keys(errors).length === 0) { // No errors
        next();
    } else {
        request.errorslist = errors; // Error(s) were found
        next(new Error("order"));
    }
});

// 3. Compute price of the order
app.get("/order", function(request, response, next) {
    request.order.bill = support.computeBill(request.order);
    next();
});

// 4. Display the order and total cost
app.get("/order", function(request, response) {
    response.render("receipt", {order: request.order});
});


// The order was invalid, send error message back to user
app.use("/order", function(err, request, response, next) {
    if (err.message.includes("order")) {
        response.render("orderformerror", {booklist: support.getBookList(),
                                            errors: request.errorslist, 
                                            quantity: request.query.quantity});
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