// *********************************************************************************
// api-routes.js - this file offers a set of routes for displaying and saving data to the db
// *********************************************************************************

// Dependencies
// =============================================================

// Requiring our models
var db = require("../models");

// Routes
// =============================================================
module.exports = function(app) {

    // GET route for getting all of the posts
    app.get("/api/passengers", function(req, res) {
        var query = {};
        if (req.query.passenger_id) {
            query.DriverId = req.query.driver_id;
        }
        // Here we add an "include" property to our options in our findAll query
        // We set the value to an array of the models we want to include in a left outer join
        // In this case, just db.Author
        db.Passenger.findAll({
            where: query,
            include: [db.Driver]
        }).then(function(dbPassenger) {
            res.json(dbPassenger);
        });
    });

    // Get route for retrieving a single post
    app.get("/api/passengers/:id", function(req, res) {
        // Here we add an "include" property to our options in our findOne query
        // We set the value to an array of the models we want to include in a left outer join
        // In this case, just db.Author
        db.Passenger.findOne({
            where: {
                id: req.params.id
            },
            include: [db.Driver]
        }).then(function(dbPassenger) {
            res.json(dbPassenger);
        });
    });

    // POST route for saving a new post
    app.post("/api/passengers", function(req, res) {
        db.Passenger.create(req.body).then(function(dbPassenger) {
            res.json(dbPassenger);
        });
    });

    // DELETE route for deleting posts
    app.delete("/api/passengers/:id", function(req, res) {
        db.Passenger.destroy({
            where: {
                id: req.params.id
            }
        }).then(function(dbPassenger) {
            res.json(dbPassenger);
        });
    });

    // PUT route for updating posts
    app.put("/api/passengers", function(req, res) {
        db.Passenger.update(
            req.body, {
                where: {
                    id: req.body.id
                }
            }).then(function(dbPassenger) {
            res.json(dbPassenger);
        });
    });
};