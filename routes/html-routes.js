// *********************************************************************************
// html-routes.js - this file offers a set of routes for sending users to the various html pages
// *********************************************************************************

// Dependencies
// =============================================================
var path = require("path");

// Routes
// =============================================================
module.exports = function(app) {

    // Each of the below routes just handles the HTML page that the user gets sent to.


    // index route loads view.html
    app.get("/", function(req, res) {
        res.sendFile(path.join(__dirname, "../public/index.html"));
    });

    // index route loads view.html
    app.get("/driver", function(req, res) {
        res.sendFile(path.join(__dirname, "../public/driver.html"));
    });

    // index route loads view.html
    app.get("/passenger", function(req, res) {
        res.sendFile(path.join(__dirname, "../public/passenger.html"));
    });

    // authors route loads routesMap.html
    app.get("/map", function(req, res) {
        res.sendFile(path.join(__dirname, "../public/routesMap.html"));
    });

    // authors route loads routesMap.html
    app.get("/passenger-map", function(req, res) {
        res.sendFile(path.join(__dirname, "../public/routesMapPassenger.html"));
    });


    // authors route loads routesMap.html
    app.get("/continue", function(req, res) {
        res.sendFile(path.join(__dirname, "../public/continue.html"));
    });

};