$(document).ready(function() {
    // Getting references to the name input and driver container, as well as the table body
    let firstName = "";
    let lastName = "";
    let userName = "";
    let driverOrigin = "";
    let driverDestination = "";

    // Adding event listeners to the form to create a new object, and the button to delete
    // an Driver
    $("#driver-form").on("submit", handleDriverFormSubmit);
    //$(document).on("click", ".delete-driver", handleDeleteButtonPress);

    // Getting the initial list of Drivers
    getDrivers();

    // A function to handle what happens when the form is submitted to create a new Driver
    async function handleDriverFormSubmit(event) {
        event.preventDefault();
        // Getting references to the name input and driver container, as well as the table body
        firstName = $("#firstName");
        lastName = $("#lastName");
        userName = $("#userName");
        driverOrigin = $("#origin");
        driverDestination = $("#destination");

        // Don't register if the name fields hasn't been filled out entirely
        if (!firstName.val().trim() || !lastName.val().trim() || !userName.val().trim() || !driverOrigin.val().trim() || !driverDestination.val().trim()) {
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
                    console.log(i, userName.val().trim(), response[i].userName)
                    console.log(userName.val().trim() == response[i].userName)
                    if (userName.val().trim() == response[i].userName) {
                        console.log("Forloop breat at i = " + i + "of" + response.length)
                        alert("User name " + userName.val().trim() + " already exist. Register with another user name");
                        return;
                    }
                }
                // Calling the upsertDriver function and passing in values of driver parameters
                upsertDriver({
                    firstName: firstName.val().trim(),
                    lastName: lastName.val().trim(),
                    userName: userName.val().trim(),
                    homeAddress: driverOrigin.val().trim(),
                    workAddress: driverDestination.val().trim(),
                    waypoints: "",
                    directDuration: 0,
                    poolDuraction: 0,
                    timeDifference: 0,
                    type: "Driver"
                });
                alert("Driver profile created for " + firstName.val().trim() + " " + lastName.val().trim() + ". Do not forget to record your user name: " + userName.val().trim())

            })
    }

    // A function for creating an driver. Calls getDrivers upon completion
    function upsertDriver(driverData) {
        console.log(driverData.firstName, driverData.lastName)
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