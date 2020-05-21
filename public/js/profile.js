$(document).ready(function() {

    //Google map API request parameter variables
    let directionsService = new google.maps.DirectionsService();
    let map, data, bounds;
    let requestArray = [],
        renderArray = [];

    // Standard Colours for navigation polylines
    let routeColor = ['blue', 'green', 'red'];
    let lineWeight = [5, 3, 7];
    let markerScale = [7, 5, 3];


    let routesArray = {}; //User and routes;
    let routesOptions = {}; // routes in options with a passenger or driver
    let passengersRoutes = {}; // passengers direct route
    let driversRoutes = {}; // drivers direct route
    let optionsIdentity = {};
    let durationsDistances = {}; //[sec, h, km]

    let option = 0;


    let queryURL = ""; //User API url
    let queryURL2 = ""; // API to get potential associate

    //Login data
    let inputFname = "";
    let inputUname = "";
    let inputType = "";

    //Signing in user data
    let userFname = "";
    let userLname = "";
    let userType = "";

    //True if the signing in user is found
    let isUser = false;


    //Direct route time in second
    let direcTime = 0;

    //Finding the user data and processing
    $("#signIn").on("submit", displayUser);

    function displayUser(event) {
        event.preventDefault();

        inputFname = $("#firstName").val().trim();
        inputUname = $("#userName").val().trim();
        inputType = $("#userType option:selected").val();


        if (inputType == "Driver") {
            queryURL = "http://localhost:8080/api/drivers"
            queryURL2 = "http://localhost:8080/api/passengers"
        } else {
            queryURL = "http://localhost:8080/api/passengers"
            queryURL2 = "http://localhost:8080/api/drivers"
        }

        $.ajax({
                url: queryURL,
                method: "GET"
            })
            .then(function(response) {

                for (let i = 0; i < response.length; i++) {
                    userFname = response[i].firstName;
                    userLname = response[i].lastName;
                    userUname = response[i].userName;
                    userOrigin = response[i].homeAddress;
                    userDestination = response[i].workAddress;
                    console.log(i, userOrigin, userDestination)

                    userType = response[i].type;

                    console.log(inputFname == userFname, inputUname == userUname, inputType == userType)
                    console.log(inputFname, userFname, inputUname, userUname, inputType, userType)

                    if (inputFname == userFname && inputUname == userUname && inputType == userType) {

                        isUser = true;
                        $("#welcome").html("Welcome " + userFname + " " + userLname + "!");
                        $("#yourRoute").html(userType + " direct route...");
                        if (userType == "Passenger") {
                            $("#yourRoute").css("color", "red");
                        }
                        $("#origin").html(userOrigin);
                        $("#dest").html(userDestination);
                        $("#signIn").css("display", "none");
                        $(".profile").css("display", "block");

                        routesArray.directRoute = [userOrigin, userDestination] // displayed routes

                        // Make list with altrnative routes with available passengers
                        if (userType == "Driver") {
                            passengerOptions()
                        }
                        if (userType == "Passenger") {
                            driverOptions()
                            $("#list").html("Select your driver")
                        }

                        generateRequests()
                        break;
                    }

                }
            }).then(function() {
                console.log(isUser + " Conclude")
                if (!isUser) {
                    alert("User " + inputFname + " not found")
                }
            });
    }

    // For a Driver user make route with each available passenger
    function passengerOptions() {
        $.ajax({
                url: queryURL2,
                method: "GET"
            })
            .then(function(response2) {
                for (let i = 0; i < response2.length; i++) {
                    let j = i + 1;
                    passengersRoutes["route" + j] = [response2[i].homeAddress, response2[i].workAddress];
                    optionsIdentity["route" + j] = [response2[i].firstName, response2[i].lastName];
                    console.log("optionsIdentity" + optionsIdentity["route" + j][1])

                    let driverRoute = [userOrigin, userDestination];
                    driverRoute.splice(1, 0, response2[i].homeAddress, response2[i].workAddress);
                    routesOptions["derouted" + j] = driverRoute;
                    let option = "<option value=\"" + response2[i].id + "\">" + response2[i].id + " | " + response2[i].firstName + " " + response2[i].lastName + " </option>";
                    $("#select").append(option);
                }
            });
    }

    // For a Passenger user make route with each available driver
    function driverOptions() {
        $.ajax({
                url: queryURL2,
                method: "GET"
            })
            .then(function(response2) {
                for (let i = 0; i < response2.length; i++) {
                    let j = i + 1;
                    driversRoutes["route" + j] = [response2[i].homeAddress, response2[i].workAddress]
                    optionsIdentity["route" + j] = [response2[i].firstName, response2[i].lastName];
                    let driverRoute = [response2[i].homeAddress, response2[i].workAddress]
                    driverRoute.splice(1, 0, userOrigin, userDestination);
                    routesOptions["derouted" + j] = driverRoute;
                    let option = "<option value=\"" + response2[i].id + "\">" + response2[i].id + " | " + response2[i].firstName + " " + response2[i].lastName + " </option>";
                    $("#select").append(option);

                    console.log(j, routesOptions)
                }
            });
    }

    //Making requests which will become individual polylines on the map is more than 1 elements in the array.
    function generateRequests() {

        console.log(routesArray);
        requestArray = [];
        for (var route in routesArray) {
            // This now deals with one of the people / routes

            // Somewhere to store the wayoints
            var waypts = [];

            // 'start' and 'finish' will be the routes origin and destination
            var start, finish

            // lastpoint is used to ensure that duplicate waypoints are stripped
            var lastpoint

            data = routesArray[route]

            limit = data.length
            for (var waypoint = 0; waypoint < limit; waypoint++) {
                if (data[waypoint] === lastpoint) {
                    // Duplicate of of the last waypoint - don't bother
                    continue;
                }

                // Prepare the lastpoint for the next loop
                lastpoint = data[waypoint]

                // Add this to waypoint to the array for making the request
                waypts.push({
                    location: data[waypoint],
                    stopover: true
                });
            }

            // Grab the first waypoint for the 'start' location
            start = (waypts.shift()).location;
            // Grab the last waypoint for use as a 'finish' location
            finish = waypts.pop();
            if (finish === undefined) {
                // Unless there was no finish location for some reason?
                finish = start;
            } else {
                finish = finish.location;
            }

            // Let's create the Google Maps request object
            var request = {
                origin: start,
                destination: finish,
                waypoints: waypts,
                travelMode: google.maps.TravelMode.DRIVING
            };

            // and save it in our requestArray
            requestArray.push({
                "route": route,
                "request": request
            });
        }

        processRequests();
    }

    function processRequests() {

        // Counter to track request submission and process one at a time;
        var i = 0;

        // Used to submit the request 'i'
        function submitRequest() {
            directionsService.route(requestArray[i].request, directionResults);
        }

        // Used as callback for the above request for current 'i'
        function directionResults(result, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                // Create a unique DirectionsRenderer 'i'
                renderArray[i] = new google.maps.DirectionsRenderer();
                renderArray[i].setMap(map);
                // Some unique options from the routeColor so we can see the routes
                let strokeColor = routeColor[i];
                console.log(i, option, userType)
                if (option == 0 && userType == "Passenger") {
                    strokeColor = "red"
                }
                renderArray[i].setOptions({
                    preserveViewport: true,
                    suppressInfoWindows: true,
                    polylineOptions: {
                        strokeWeight: lineWeight[i],
                        strokeOpacity: 0.9,
                        strokeColor: strokeColor
                    },
                    markerOptions: {
                        icon: {
                            path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                            scale: markerScale[i],
                            strokeColor: strokeColor
                        }
                    }
                });

                // Use this new renderer with the result
                renderArray[i].setDirections(result);
                // and start the next request
                nextRequest();

                bounds.union(result.routes[0].bounds);
                // zoom and center the map to show all the routes
                map.fitBounds(bounds);

                //Route duration and distance
                durationsDistances["route" + i] = durationNdistance(result);
                console.log(durationsDistances)
                console.log(i, durationsDistances["route" + i])
            }
        }

        function nextRequest() {
            // Increase the counter
            i++;
            // Make sure we are still waiting for a request
            if (i >= requestArray.length) {
                // No more to do
                return;
            }
            // Submit another request
            submitRequest();
        }
        // This request is just to kick start the whole process
        submitRequest();
    }

    // A function to calculate distanes et duration
    function durationNdistance(result) {
        let distance = 0; //distance
        let time = 0; //duration in secondes
        let duration = ""; //duration in hours and minutes
        let route = result.routes[0];
        for (var i = 0; i < route.legs.length; i++) {
            distance += route.legs[i].distance.value;
            time += route.legs[i].duration.value;
        }
        distance = (distance / 1000).toFixed(1);
        // Converting seconds in hours and minutes
        let hours = Math.floor(time / 3600);
        let minutes = Math.round((time % 3600) / 60);
        duration = hours + " h " + minutes + " min";
        let timeDuration = [time, duration, distance];
        let direct = $("#directTime").html()
            //Fill only is the direct route calculation
        if (direct == "wait...") {
            $("#directTime").html(duration);
            $("#directDistance").html(distance + " km");
        }
        return timeDuration;
    }

    //Selecting the a Passenger (for Driver) or a Driver (for a Passenger)
    $("#select").change(seclectOption);

    function seclectOption() {
        option = $("#select option:selected").val()
        routesArray = {}
        if (option != 0) {
            $(".carpool").css("display", "block");
            if (userType == "Driver") {
                routesArray.directRoute = [userOrigin, userDestination]; // driver direct route
                routesArray.derouted = routesOptions["derouted" + option]; // driver route derouted to pick up passenger
                routesArray.passenger = passengersRoutes["route" + option]; // passenger direct route
                $("#companion").html("Passenger: " + optionsIdentity["route" + option][0] + " " + optionsIdentity["route" + option][1] + " direct route...");
                $(".passengerDirect").css("display", "none");
                $("#pOrigin").html(passengersRoutes["route" + option][0])
                $("#pDestination").html(passengersRoutes["route" + option][1])
            }

            if (userType == "Passenger") {
                routesArray.directRoute = driversRoutes["route" + option]; // driver direct route
                routesArray.derouted = routesOptions["derouted" + option]; // driver route derouted to pick up passenger
                routesArray.passenger = [userOrigin, userDestination]; // passenger direct route
                $("#companion").html("Driver " + optionsIdentity["route" + option][0] + " " + optionsIdentity["route" + option][1] + " direct route...");
                $("#companion").css("color", "blue");
                // $("#pRoute").css("display", "block");
                $("#pOrigin").html(driversRoutes["route" + option][0])
                $("#pDestination").html(driversRoutes["route" + option][1])
            }



            init();
            generateRequests();

            setTimeout(function timer() {
                console.log(durationsDistances)
                $("#detouredTime").html(durationsDistances.route2[1]);
                $("#detouredDistance").html(durationsDistances.route2[2] + " km");
                //time difference calculion
                let time = durationsDistances.route2[0] - durationsDistances.route1[0];
                let hours = Math.floor(time / 3600);
                let minutes = Math.floor((time % 3600) / 60);
                timeDifference = hours + " h " + minutes + " min";
                $("#difference").html(timeDifference);

                if (userType == "Passenger") {
                    $("#dDistance").html(durationsDistances.route1[2] + " km");
                    $("#dDuration").html(durationsDistances.route1[1]);

                }

            }, 3000);


        } else {
            routesArray.directRoute = [userOrigin, userDestination];
            init();
            generateRequests();
            $("#directTime").html("wait...")
            $("#detouredTime").html("No selection");
            $("#detouredDistance").html("No selection");
            $("#difference").html("No selection");
            $("#companion").html("");
            $("#pRoute").css("display", "none");
        }
    }

    $("#merge").on("click", mergeRoutes);

    function mergeRoutes() {
        if (Option != 0) {
            routesArray = {}
            routesArray.derouted = routesOptions["derouted" + option];
            init();
            generateRequests();
        }
    }


    // Called Onload
    function init() {

        // Th map initialized in Toroto
        var mapOptions = {
            center: new google.maps.LatLng(43.651070, -79.347015),
            zoom: 10,
            mapTypeControl: false,
            streetViewControl: false,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

        // Start the request making
        bounds = new google.maps.LatLngBounds();
    }
    // Get the ball rolling and trigger our init() on 'load'
    google.maps.event.addDomListener(window, 'load', init);
});