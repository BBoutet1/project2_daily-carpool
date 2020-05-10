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



    //OLD ROUTES BELOW (to be deleted)
    //---------------------------------------------------------------

    // index route loads view.html
    app.get("/", function(req, res) {
        res.sendFile(path.join(__dirname, "../public/blog.html"));
    });

    // cms route loads cms.html
    app.get("/cms", function(req, res) {
        res.sendFile(path.join(__dirname, "../public/cms.html"));
    });

    // blog route loads blog.html
    app.get("/blog", function(req, res) {
        res.sendFile(path.join(__dirname, "../public/blog.html"));
    });

    // authors route loads author-manager.html
    app.get("/authors", function(req, res) {
        res.sendFile(path.join(__dirname, "../public/author-manager.html"));
    });


};