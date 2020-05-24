$(document).ready(function() {

    //Google map API request parameters and variables
    let directionsService = new google.maps.DirectionsService();
    let map, data, bounds;
    let requestArray = [],
        renderArray = [];

    // Routes polylines weight and color code: 
    let routeColor = ['blue', 'green', 'red']; // blue-->driver route (direct then derouted); green -->derouted driver route; red--->driver direct route
    let lineWeight = [6, 9, 2.5]; // routes polylines weight to make them distincts
    let markerScale = [7, 5, 3];

    let routesArray = {}; //User and routes;
    let routesOptions = {}; // routes in options with a passenger or driver
    let passengersRoutes = {}; // passengers direct route
    let driversRoutes = {}; // drivers direct route
    let optionsIdentity = {}; // names and first names array
    let durationsDistances = {}; //[sec, h, km]

    let option = 0; // selected passagenr (for driver) or driver (for passenger) option number

    let queryURL = ""; //Called API based on signed in user type
    let queryURL2 = ""; // Second API for route companion selection

    //First name, username, and user type retriverd from the sign in form 
    let inputFname = "";
    let inputUname = "";
    let inputType = "";

    //Signing in user data to be cheked with input entries
    let userFname = "";
    let userLname = "";
    let userType = "";

    //True if the signing in user is found
    let isUser = false;

    //Finding the user data and processing
    $("#signIn").on("submit", displayUser);

    function displayUser(event) {
        event.preventDefault();

        inputFname = $("#firstName").val().trim();
        inputUname = $("#userName").val().trim();
        inputType = $("#userType option:selected").val();


        if (inputType == "Driver") {
            queryURL = "http://localhost:8080/api/drivers" // user called API
            queryURL2 = "http://localhost:8080/api/passengers" // second API for companion selection
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
                    userType = response[i].type;

                    if (inputFname == userFname && inputUname == userUname && inputType == userType) {
                        //User identified
                        isUser = true;

                        $("#welcome").html(`Welcome ${userFname} ${userLname} !`);
                        $("#yourRoute").html(`${userType} direct route...`);
                        //Passenger route color code
                        if (userType == "Passenger") {
                            $("#yourRoute").css("color", "red");
                        }
                        $("#origin").html(userOrigin);
                        $("#dest").html(userDestination);
                        $("#signIn").css("display", "none");
                        $(".profile").css("display", "block");

                        //Direct route array
                        routesArray.directRoute = [userOrigin, userDestination]


                        if (userType == "Driver") {
                            // Make list of all passengers for a driver user
                            passengerOptions()
                        }
                        if (userType == "Passenger") {
                            // Make list of all drivers for a passenger user
                            driverOptions()
                            $("#list").html("Select your driver")
                        }
                        // generate request to googlemap API and make routes
                        generateRequests()
                        break;
                    }

                }
            }).then(function() {
                if (!isUser) {
                    //The user is not in the database
                    alert(`User ${inputFname} not found in ${inputType} database`)
                }
            });
    }

    // The user is a driver we need the list of all passengers
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
                    let driverRoute = [userOrigin, userDestination];
                    driverRoute.splice(1, 0, response2[i].homeAddress, response2[i].workAddress);
                    routesOptions["derouted" + j] = driverRoute;
                    let option = `<option value="${response2[i].id}">${i} | ${response2[i].firstName} ${response2[i].lastName}</option>`;
                    $("#select").append(option);
                }
            });
    }

    // The user is a passenger we need the list of all drivers
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
                    let option = `<option value="${response2[i].id}">${i} | ${response2[i].firstName} ${response2[i].lastName}</option>`;
                    $("#select").append(option);
                }
            });
    }

    //Making requests get individual polylines on the map, calculate distances and durationon
    function generateRequests() {

        requestArray = []; //routes array
        for (var route in routesArray) {
            // Wayoints are points in the middle between first and last points in the route array
            let waypts = [];
            // 'origin' and 'destination' are the routes origin and destination
            let origin, destination
                // lastpoint is used avoid duplicate waypoints
            let lastpoint

            data = routesArray[route]

            limit = data.length
            for (let waypoint = 0; waypoint < limit; waypoint++) {
                if (data[waypoint] === lastpoint) {
                    // Duplicate last waypoint - just in case
                    continue;
                }
                //Lastpoint for the next loop
                lastpoint = data[waypoint]

                // Adding the point to waypoint array to prepare request
                waypts.push({
                    location: data[waypoint],
                    stopover: true
                });
            }

            // The fist point in the array as route 'origin'
            origin = (waypts.shift()).location;
            // The last waypoint for use as 'destination'
            destination = waypts.pop();
            if (destination === undefined) {
                // Unless there was no destination location for some reason?
                destination = origin;
            } else {
                destination = destination.location;
            }
            // Creating Google Maps request object
            let request = {
                origin: origin,
                destination: destination,
                waypoints: waypts,
                travelMode: google.maps.TravelMode.DRIVING,
                avoidTolls: true,
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

        // Request submission counter;
        var i = 0;

        // Submitting the request 'i'
        function submitRequest() {
            directionsService.route(requestArray[i].request, directionResults);
        }

        // Callback for the above request 'i'
        function directionResults(result, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                // DirectionsRenderer 'i'
                renderArray[i] = new google.maps.DirectionsRenderer();
                renderArray[i].setMap(map);
                // Setting the route polyline color and weight
                let strokeColor = routeColor[i];
                if (option == 0 && userType == "Passenger") {
                    //passenger polyline route always red
                    strokeColor = "red"
                }


                let opacity = 1;
                if (i != 2) {
                    opacity = 0.5
                }

                renderArray[i].setOptions({
                    preserveViewport: true,
                    suppressInfoWindows: true,
                    polylineOptions: {
                        strokeWeight: lineWeight[i],
                        strokeOpacity: opacity,
                        strokeColor: strokeColor
                    },

                    markerOptions: {
                        icon: {
                            path: "",
                            scale: markerScale[i],
                            strokeColor: strokeColor
                        }

                    }
                });

                // Using Renderer with the result
                renderArray[i].setDirections(result);
                // Next request
                nextRequest();

                bounds.union(result.routes[0].bounds);
                // zoom and center the map to show all the routes
                map.fitBounds(bounds);


                //Driver origin marker
                let iconOrigin = {
                    path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                    scale: markerScale[i],
                    strokeOpacity: opacity,
                    strokeColor: strokeColor,
                };

                //Driver destination marker
                let iconDest = {
                    path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                    scale: markerScale[i],
                    strokeOpacity: opacity,
                    strokeColor: strokeColor,
                };

                // Passenger pick-up marker
                let iconWayOrigin = {
                    path: google.maps.SymbolPath.BACKWARD_OPEN_ARROW,
                    scale: markerScale[i],
                    strokeOpacity: opacity,
                    strokeColor: "red"
                };

                //passenger drop-off marker
                let iconWayDest = {
                    path: google.maps.SymbolPath.FORWARD_OPEN_ARROW,
                    scale: markerScale[i],
                    strokeOpacity: opacity,
                    strokeColor: "red"
                };

                let legs = result.routes[0].legs; // route legs array
                let legsNum = legs.length; // number of legs
                let originLeg = result.routes[0].legs[0]; // first leg
                let destLeg = result.routes[0].legs[legsNum - 1] // last leg

                //The if condition just to avoid duplicate marker label
                if (option == 0 || (option != 0 && legsNum > 2)) {
                    makeMarker(originLeg.start_location, iconOrigin, { text: "ORIG", color: "brown" }) //driver origin marker
                    makeMarker(destLeg.end_location, iconDest, { text: "DEST", color: "brown" }) // driver destination marker
                } else {
                    makeMarker(originLeg.start_location, iconOrigin)
                    makeMarker(destLeg.end_location, iconDest, )
                }

                for (i = 1; i < (legsNum - 1); i++) {
                    let originWpt = result.routes[0].legs[i];
                    let destWpt = result.routes[0].legs[i]
                    if (option == 0) {
                        makeMarker(originWpt.start_location, iconWayOrigin) // passenger pick-up marker
                        makeMarker(destWpt.end_location, iconWayDest) // passenger dropp-off marker
                    } else {
                        makeMarker(originWpt.start_location, iconWayOrigin, { text: "PICK", color: "brown" })
                        makeMarker(destWpt.end_location, iconWayDest, { text: "DROP", color: "brown" })
                    }

                }

                //Route duration and distance
                durationsDistances["route" + i] = durationNdistance(result);

            } else {
                alert('Directions request failed due to ' + status);
                $(".detour").html("No results");
                return
            }
        }

        function nextRequest() {
            i++;
            if (i >= requestArray.length) {
                // Last request reached
                return;
            }
            // Submit next request
            submitRequest();
        }
        // This request is just to kick origin the whole process
        submitRequest();
    }

    //A function to make marker for origin and destination

    function makeMarker(position, icon, label) {
        new google.maps.Marker({
            position: position,
            map: map,
            icon: icon,
            label: label
        });
    }

    // A function to calculate distance and duration
    function durationNdistance(result) {
        let distance = 0; //distance
        let time = 0; //duration in seconds
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
        let direct = $("#directTime").html() // display the direct route duration
            //Fill only if it is the user direct route calculation
        if (direct == "wait...") {
            $("#directTime").html(duration);
            $("#directDistance").html(distance + " km");
        }
        // returning calculation data for the detoured route data rendering
        return timeDuration;
    }

    //Selecting the a Passenger (for Driver) or a Driver (for a Passenger)
    $("#select").change(seclectOption);

    function seclectOption() {
        option = $("#select option:selected").val()
        routesArray = {}
        if (option != 0) {
            // We have a detour option selected
            $(".carpool").css("display", "block");
            if (userType == "Driver") {
                routesArray.directRoute = [userOrigin, userDestination]; // driver direct route
                routesArray.derouted = routesOptions["derouted" + option]; // driver route derouted to pick up passenger
                routesArray.passenger = passengersRoutes["route" + option]; // passenger direct route
                $("#companion").html(`Passenger: ${optionsIdentity["route" + option][0]} ${optionsIdentity["route" + option][1]} direct route...`);
                $(".passengerDirect").css("display", "none");
                $("#pOrigin").html(passengersRoutes["route" + option][0])
                $("#pDestination").html(passengersRoutes["route" + option][1])
            }

            if (userType == "Passenger") {
                routesArray.directRoute = driversRoutes["route" + option]; // driver direct route
                routesArray.derouted = routesOptions["derouted" + option]; // driver route derouted to pick up passenger
                routesArray.passenger = [userOrigin, userDestination]; // passenger direct route
                $("#companion").html(`"Driver: ${optionsIdentity["route" + option][0]} ${optionsIdentity["route" + option][1]} direct route...`);
                $("#companion").css("color", "blue");
                $("#pOrigin").html(driversRoutes["route" + option][0])
                $("#pDestination").html(driversRoutes["route" + option][1])
            }

            init();
            generateRequests();

            // Need durations and distances calculation to finish before continue processing
            setTimeout(function timer() {
                $("#detouredTime").html(durationsDistances.route2[1]);
                $("#detouredDistance").html(durationsDistances.route2[2] + " km");
                //time difference calculion
                let time = durationsDistances.route2[0] - durationsDistances.route1[0];
                let hours = Math.floor(time / 3600);
                let minutes = Math.floor((time % 3600) / 60);
                timeDifference = hours + " h " + minutes + " min";
                $("#difference").html(timeDifference);

                if (userType == "Passenger") {
                    // direct route data for passenger in a different table(not use for driving duration and distance)
                    $("#dDistance").html(durationsDistances.route1[2] + " km");
                    $("#dDuration").html(durationsDistances.route1[1]);
                }

            }, 5000);

        } else {
            // No detour option selected (deselected)
            routesArray.directRoute = [userOrigin, userDestination];
            init();
            generateRequests();
            $("#directTime").html("wait...")
            $("#companion").html("");
            $("#pRoute").css("display", "none");
            $(".carpool").css("display", "none");
        }
    }

    // Merge route button allow to show up only the detoured route that includes waypoints for the passenger
    $("#merge").on("click", mergeRoutes);

    function mergeRoutes() {
        if (Option != 0) {
            routesArray = {}
            routesArray.derouted = routesOptions["derouted" + option];
            init();
            generateRequests();
        }
    }
    // Called Onload to initialie the map
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