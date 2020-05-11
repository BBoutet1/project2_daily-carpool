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
        res.sendFile(path.join(__dirname, "../public/Driver.html"));
    });

    // index route loads view.html
    app.get("/passenger", function(req, res) {
        res.sendFile(path.join(__dirname, "../public/Passenger.html"));
    });
    //loads new pages added to help with storing and retreving user input data
    app.get("/passengerReservation", function(req, res) {
        res.sendFile(path.join(__dirname, "../public/passengerReservation.html"));
    });
    app.get("/driverList", function(req, res) {
        res.sendFile(path.join(__dirname, "../public/driverList.html"));
    });

    // authors route loads routesMap.html
    app.get("/map", function(req, res) {
        res.sendFile(path.join(__dirname, "../public/routesMap.html"));
    });





};