$(document).ready(function() {
    // Getting references to the name input and driver container, as well as the table body
    let dFirstName = "";
    let dLastName = "";
    let dUserName = "";
    let driverOrigin = "";
    let driverDestination = "";
    let userAccepted = true;



    // Adding event listeners to the form to create a new object, and the button to delete
    // an Driver
    $("#driver-form").on("submit", handleDriverFormSubmit);
    //$(document).on("click", ".delete-driver", handleDeleteButtonPress);

    // Getting the initial list of Drivers
    getDrivers();

    // A function to handle what happens when the form is submitted to create a new Driver
    function handleDriverFormSubmit(event) {
        event.preventDefault();
        // Getting references to the name input and driver container, as well as the table body
        firstName = $("#firstName").val().trim();
        lastName = $("#lastName").val().trim();
        userName = $("#userName").val().trim();
        driverOrigin = $("#origin").val().trim();
        driverDestination = $("#destination").val().trim();


        // Don't register if the name fields hasn't been filled out entirely
        if ((!firstName || !lastName || !userName || !driverOrigin || !driverDestination)) {
            alert("Form not completed. Please fill up the form!")
            return;
        }

        let queryURL = "http://localhost:8080/api/drivers";
        $.ajax({
                url: queryURL,
                method: "GET"
            })
            .then(function(response) {
                for (let i = 0; i < response.length; i++) {
                    let presentUser = response[i].userName;
                    if (userName == presentUser) {
                        userAvailable = false;
                        userAccepted = false;
                    }
                }
            }).then(function(response) { //Don't register if the user name already exist
                if (!userAccepted) {
                    console.log(userAccepted)
                    alert("User name " + userName + " already exist. Register with another user name");
                    return;
                }

                // Calling the upsertDriver function and passing in values of driver parameters
                upsertDriver({
                    firstName: firstName,
                    lastName: lastName,
                    userName: userName,
                    homeAddress: driverOrigin,
                    workAddress: driverDestination,
                    waypoints: "",
                    directDuration: 0,
                    poolDuraction: 0,
                    timeDifference: 0,
                    type: "Driver"
                });
                alert("Driver profile created for " + firstName + " " + lastName + ". Record your user name: " + userName)
            });
    }


    // A function for creating an driver. Calls getDrivers upon completion
    function upsertDriver(driverData) {
        console.log(driverData)
        $.post("/api/drivers", driverData)
            .then(getDrivers);
    }

    // Function for creating a new list row for drivers
    function createDriverRow(driverData) {
        var newTr = $("<tr>");
        newTr.data("driver", driverData);
        newTr.append("<td>" + driverData.name + "</td>");
        if (driverData.Posts) {
            newTr.append("<td> " + driverData.Posts.length + "</td>");
        } else {
            newTr.append("<td>0</td>");
        }
        newTr.append("<td><a href='/blog?driver_id=" + driverData.id + "'>Go to Posts</a></td>");
        newTr.append("<td><a href='/cms?driver_id=" + driverData.id + "'>Create a Post</a></td>");
        newTr.append("<td><a style='cursor:pointer;color:red' class='delete-driver'>Delete Driver</a></td>");
        return newTr;
    }

    // Function for retrieving drivers and getting them ready to be rendered to the page
    function getDrivers() {
        $.get("/api/drivers", function(data) {
            var rowsToAdd = [];
            for (var i = 0; i < data.length; i++) {
                rowsToAdd.push(createDriverRow(data[i]));
            }
            //renderDriverList(rowsToAdd);
            // driverName.val("");
        });
    }

    // A function for rendering the list of drivers to the page
    function renderDriverList(rows) {
        driverList.children().not(":last").remove();
        driverContainer.children(".alert").remove();
        if (rows.length) {
            console.log(rows);
            driverList.prepend(rows);
        } else {
            renderEmpty();
        }
    }

    // Function for handling what to render when there are no drivers
    function renderEmpty() {
        var alertDiv = $("<div>");
        alertDiv.addClass("alert alert-danger");
        alertDiv.text("You must create an Driver before you can create a Post.");
        driverContainer.append(alertDiv);
    }

    // Function for handling what happens when the delete button is pressed
    // function handleDeleteButtonPress() {
    //     var listItemData = $(this).parent("td").parent("tr").data("driver");
    //     var id = listItemData.id;
    //     $.ajax({
    //             method: "DELETE",
    //             url: "/api/drivers/" + id
    //         })
    //         .then(getDrivers);
    // }
}); // }