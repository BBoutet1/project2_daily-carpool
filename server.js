// *****************************************************************************
// Server.js - This file is the initial starting point for the Node/Express server.
//
// ******************************************************************************
// *** Dependencies
// =============================================================

var express = require("express");
var compression = require('compression')


// Sets up the Express App
// =============================================================
var app = express();
app.use(compression())

var PORT = process.env.PORT || 8080;

// Requiring our models for syncing
var db = require("./models");

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));

app.use(express.json());


// Static directory
app.use(express.static("public"));

// app.use(routes);

// Routes
// =============================================================
require("./routes/html-routes.js")(app);
require("./routes/driver-api-routes.js")(app);
require("./routes/passenger-api-routes.js")(app);

// Syncing our sequelize models and then starting our Express app
// =============================================================
db.sequelize.sync({}).then(function() {
    app.listen(PORT, function() {
        console.log("App listening on PORT " + PORT);
    });
});