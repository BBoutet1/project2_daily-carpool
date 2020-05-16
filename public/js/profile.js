$(document).ready(function() {
    var directionsService = new google.maps.DirectionsService();
    var num, map, data, bounds;
    var requestArray = [],
        renderArray = [];
    $("#signIn").on("submit", displayUser);
    // Initialise some variables
    // A JSON Array containing some people/routes and the destinations/stops


    var routesArray = {}

    function displayUser(event) {
        event.preventDefault();
        const inputName = $("#userName").val().trim();
        const inputOrigin = $("#userOrigin").val().trim();
        const inputType = $("#userType option:selected").val();

        let userName = "";
        let userOrigin = "";
        let userDestination = "";
        let userType = "";

        let isUser = false;

        let apiType = "";
        if (iputRype = "Driver") {
            apiType = "drivers"
        } else { apiType = "passagers" }

        let queryURL = "http://localhost:8080/api/" + apiType;

        $.ajax({
                url: queryURL,
                method: "GET"
            })
            .then(function(response) {
                for (let i = 0; i < response.length; i++) {
                    console.log(i)
                    console.log(isUser + " start")
                    userName = response[i].name;
                    userOrigin = response[i].homeAddress;
                    userDestination = response[i].workAddress;
                    userType = response[i].type;


                    // A JSON Array containing some people/routes and the destinations/stops

                    var routesArray = {}




                    // Standard Colours for navigation polylines
                    var routeColor = ['maroon', 'purple', 'aqua', 'red', 'green', 'silver', 'olive', 'blue', 'yellow', 'teal'];

                    // Let's make an array of requests which will become individual polylines on the map.
                    function generateRequests() {

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
                                renderArray[i].setOptions({
                                    preserveViewport: true,
                                    suppressInfoWindows: true,
                                    polylineOptions: {
                                        strokeWeight: 4,
                                        strokeOpacity: 0.8,
                                        strokeColor: routeColor[i]
                                    },
                                    markerOptions: {
                                        icon: {
                                            path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                                            scale: 3,
                                            strokeColor: routeColor[i]
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

                    if (inputName == userName && inputOrigin == userOrigin && inputType == userType) {
                        routesArray.userRoute = [userOrigin, userDestination]
                        isUser = true;
                        $("#welcome").html("Welcome " + userName + "!");
                        $("#yourRoute").html("Manage your " + userType + " route...");
                        $("#saveType").html(userType); //used in routeMap.js calculation
                        $("#origin").html(userOrigin);
                        $("#dest").html(userDestination);
                        $("#signIn").css("display", "none");
                        $(".profile").css("display", "block")
                        generateRequests()
                    }
                }

            }).then(function() {
                console.log(isUser + " Conclude")
                if (!isUser) {
                    $("#userName").html("User " + userName + " from " + userOrigin + " does not exist");
                    alert("User " + userName + " from " + userOrigin + " does not exist")
                }
            });

    }
    // Called Onload
    function init() {

        // Some basic map setup (from the API docs)
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