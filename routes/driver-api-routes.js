var db = require("../models");

module.exports = function(app) {
    // app.get("/api/drivers", function(req, res) {
    //     // Here we add an "include" property to our options in our findAll query
    //     // We set the value to an array of the models we want to include in a left outer join
    //     // In this case, just db.Passenger
    //     db.Driver.findAll({
    //         include: [db.Passenger]
    //     }).then(function(dbDriver) {
    //         res.json(dbDriver);
    //     });
    // });

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
    //==========================

    //Driver informations

    const axios = require("axios");

    const time = {
        async getDuration(origin, destination, waypoints) {
            try {
                let durationSec = 0;
                const { data } = await axios.get(
                    `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&waypoints=${waypoints}&region=ca&key=AIzaSyDXes9rc5Lm0f5N-D5M1lZO3ShcRCJPWk8`
                );
                const legs = data.routes[0].legs;
                for (let i = 0; i < legs.length; i++) {
                    durationSec += legs[i].duration.value;
                }
                console.log(durationSec);
                return durationSec;
            } catch (err) {
                console.log(err);
            }
        },
    };

    const origin = "L7A 0W6";
    const destination = "L4W 2S5";
    const noWaypoint = ""
    const waypoints = "L7A 3P6|L6T 4P8";
    let directDurationSec, directDuration;
    let poolDurationSec, poolDuration;
    let timeDifferenceSec, timeDifference;
    let driverData;

    async function getD() {
        // Time in seconds
        directDurationSec = await time.getDuration(origin, destination, noWaypoint);
        poolDurationSec = await time.getDuration(origin, destination, waypoints);
        timeDifferenceSec = await poolDurationSec - directDurationSec;
        //-----------------------------------------------------------------
        // Time in hours and minutes
        directDuration = await timeConversion(directDurationSec);
        poolDuration = await timeConversion(poolDurationSec);
        timeDifference = await timeConversion(timeDifferenceSec);


        driverData = {
                name: "",
                homeAddress: origin,
                workAddress: destination,
                email: "",
                waypoints: waypoints,
                directDuration: directDuration,
                poolDuraction: poolDuration,
                timeDifference: timeDifference,
                passagenrNumber: 0,
            }
            // Calling the upsertDriver function and passing in the DriverData objet
            //===========================================================================
        upsertDriver(driverData);
    }
    getD()
    async function timeConversion(time) {
        // Converting seconds in hours and minutes
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time % 3600) / 60);
        const duration = hours + " hours " + minutes + " minutes"
        console.log(duration)
        return duration;
    }

    // A function for creating an driver. Calls getDrivers upon completion
    function upsertDriver(driverData) {
        // $.post("/api/drivers", driverData)
        //     .then(getDrivers);
        console.log(driverData)
        app.get('/api/drivers', (req, res) => {
            res.send(driverData)
        })

    }
    //===============================================





    // app.post("/api/drivers", function(req, res) {
    //     db.Driver.create(req.body).then(function(dbDriver) {
    //         res.json(dbDriver);
    //     });
    // });

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