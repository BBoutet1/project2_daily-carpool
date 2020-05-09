var db = require("../models");

module.exports = function(app) {
    app.get("/api/drivers", function(req, res) {
        // Here we add an "include" property to our options in our findAll query
        // We set the value to an array of the models we want to include in a left outer join
        // In this case, just db.Passenger
        db.Driver.findAll({
            include: [db.Passenger]
        }).then(function(dbDriver) {
            res.json(dbDriver);
        });
    });

    app.get("/api/drivers/:id", function(req, res) {
        // Here we add an "include" property to our options in our findOne query
        // We set the value to an array of the models we want to include in a left outer join
        // In this case, just db.Passenger
        db.Driver.findOne({
            where: {
                id: req.params.id
            },
            include: [db.Passenger]
        }).then(function(dbDriver) {
            res.json(dbDriver);
        });
    });

    app.post("/api/drivers", function(req, res) {
        db.Driver.create(req.body).then(function(dbDriver) {
            res.json(dbDriver);
        });
    });

    app.delete("/api/drivers/:id", function(req, res) {
        db.Driver.destroy({
            where: {
                id: req.params.id
            }
        }).then(function(dbDriver) {
            res.json(dbDriver);
        });
    });

};