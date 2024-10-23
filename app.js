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

// Have the app listen on port 3000
http.createServer(app).listen(3000);
