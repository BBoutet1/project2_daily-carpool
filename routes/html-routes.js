// *********************************************************************************
// html-routes.js - this file offers a set of routes for sending users to the various html pages
// *********************************************************************************

// Dependencies
// =============================================================
var path = require("path");

// Set Handlebars.
var exphbs = require("express-handlebars");




// Routes
// =============================================================
module.exports = function(app) {

    // Set Handlebars as the default templating engine.
    app.engine("handlebars", exphbs({ defaultLayout: "main" }));
    app.set("view engine", "handlebars");

    // Each of the below routes just handles the HTML page that the user gets sent to.

    //Index page route load index.handlebars
    app.get("/", function(req, res) {
        res.render("index", { title: "Home" })
    });

    // Driver register route loads driver.handlebars
    app.get("/driver", function(req, res) {
        res.render("driver", { title: "Driver register" })
    });

    // Passenger register route loads passenger.handlebars
    app.get("/passenger", function(req, res) {
        res.render("passenger", { title: "Passenger register" })
    });

    // Profile Sign in route loads profile.handlebars
    app.get("/profile", function(req, res) {
        res.render("profile", { title: "User profile" })
    });

};