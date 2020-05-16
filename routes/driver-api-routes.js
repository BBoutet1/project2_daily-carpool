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

    // GET route for getting all of the drivers
    app.get("/api/drivers", function(req, res) {
        var query = {};
        if (req.query.driver_id) {
            query.DriverId = req.query.driver_id;
        }
        //Distance calculation
        //*****************************/
        //let query = {};
        // let origin = req.query.homeAddress;
        // console.log(origin)
        // let destination = req.query.workAddress;
        // let APIkey = AIzaSyDE2yBUEZx3Cup_pwq22o_WferVgBpgSdE;
        // let queryURL = "https://maps.googleapis.com/maps/api/distancematrix/json?origins=" +
        //     origin + "&destinations=" + destination + "&mode=driving&key=" + APIkey;

        // $.ajax({
        //         url: queryURL,
        //         method: "GET"
        //     })
        //     .then(function(response) {
        //         for (let i = 0; i < response.length; i++) {
        //             userName = response[i].name;
        //             userOrigin = response[i].homeAddress;
        //             userDestination = response[i].workAddress;
        //             userType = response[i].type;
        //             if (inputName == userName && inputOrigin == userOrigin && inputType == userType) {
        //                 isUser = true;
        //                 $("#welcome").html("Welcome " + userName + "!");
        //                 $("#origin").html(userOrigin);
        //                 $("#dest").html(userDestination);
        //                 $("#signIn").css("display", "none")
        //                 $(".profile").css("display", "block")
        //             }
        //         }

        //     })


        //********************************** */
        // Here we add an "include" property to our options in our findAll query
        // We set the value to an array of the models we want to include in a left outer join
        // In this case, just db.Author
        db.Driver.findAll({
            where: query,
            // include: [db.Driver]
        }).then(function(dbDriver) {
            res.json(dbDriver);
        });
    });

    // Get route for retrieving a single post
    app.get("/api/drivers/:id", function(req, res) {
        // Here we add an "include" property to our options in our findOne query
        // We set the value to an array of the models we want to include in a left outer join
        // In this case, just db.Author
        db.Driver.findOne({
            where: {
                id: req.params.id
            },
            include: [db.Driver]
        }).then(function(dbDriver) {
            res.json(dbDriver);
        });
    });

    // POST route for saving a new post
    app.post("/api/drivers", function(req, res) {
        db.Driver.create(req.body).then(function(dbDriver) {
            res.json(dbDriver);
        });
    });

    // DELETE route for deleting posts
    app.delete("/api/drivers/:id", function(req, res) {
        db.Driver.destroy({
            where: {
                id: req.params.id
            }
        }).then(function(dbDriver) {
            res.json(dbDriver);
        });
    });

    // PUT route for updating posts
    app.put("/api/drivers", function(req, res) {
        db.Driver.update(
            req.body, {
                where: {
                    id: req.body.id
                }
            }).then(function(dbDriver) {
            res.json(dbDriver);
        });
    });
};