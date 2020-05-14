$(document).ready(function() {
    // Getting references to the name input and passenger container, as well as the table body
    var passengerName = "";
    // var passengerEmail = $("#email");
    var passengerOrigin = "";
    var passengerDestination = "";

    // Adding event listeners to the form to create a new object, and the button to delete
    // an Passenger
    $("#passenger-form").on("submit", handlePassengerFormSubmit);
    //$(document).on("click", ".delete-passenger", handleDeleteButtonPress);

    // Getting the initial list of Passengers
    getPassengers();

    // A function to handle what happens when the form is submitted to create a new Passenger
    function handlePassengerFormSubmit(event) {
        event.preventDefault();
        // Getting references to the name input and passenger container, as well as the table body
        passengerName = $("#name");
        // var passengerEmail = $("#email");
        passengerOrigin = $("#origin");
        passengerDestination = $("#destination");
        // Don't do anything if the name fields hasn't been filled out
        if (!passengerName.val().trim() || !passengerOrigin.val().trim() || !passengerDestination.val().trim()) {
            return;
        }
        // Calling the upsertPassenger function and passing in values of passenger parameters
        upsertPassenger({
            name: passengerName.val().trim(),
            homeAddress: passengerOrigin.val().trim(),
            workAddress: passengerDestination.val().trim(),
            waypoints: "",
        });
    }

    // A function for creating an passenger. Calls getPassengers upon completion
    function upsertPassenger(passengerData) {
        console.log(passengerData)
        $.post("/api/passengers", passengerData)
            .then(getPassengers);
    }

    // Function for creating a new list row for passengers
    function createPassengerRow(passengerData) {
        var newTr = $("<tr>");
        newTr.data("passenger", passengerData);
        newTr.append("<td>" + passengerData.name + "</td>");
        if (passengerData.Posts) {
            newTr.append("<td> " + passengerData.Posts.length + "</td>");
        } else {
            newTr.append("<td>0</td>");
        }
        newTr.append("<td><a href='/blog?passenger_id=" + passengerData.id + "'>Go to Posts</a></td>");
        newTr.append("<td><a href='/cms?passenger_id=" + passengerData.id + "'>Create a Post</a></td>");
        newTr.append("<td><a style='cursor:pointer;color:red' class='delete-passenger'>Delete Passenger</a></td>");
        return newTr;
    }

    // Function for retrieving passengers and getting them ready to be rendered to the page
    function getPassengers() {
        $.get("/api/passengers", function(data) {
            var rowsToAdd = [];
            for (var i = 0; i < data.length; i++) {
                rowsToAdd.push(createPassengerRow(data[i]));
            }
            // renderPassengerList(rowsToAdd);
            passengerName.val("");
        });
    }

    // A function for rendering the list of passengers to the page
    function renderPassengerList(rows) {
        passengerList.children().not(":last").remove();
        passengerContainer.children(".alert").remove();
        if (rows.length) {
            console.log(rows);
            passengerList.prepend(rows);
        } else {
            renderEmpty();
        }
    }

    // Function for handling what to render when there are no passengers
    function renderEmpty() {
        var alertDiv = $("<div>");
        alertDiv.addClass("alert alert-danger");
        alertDiv.text("You must create an Passenger before you can create a Post.");
        passengerContainer.append(alertDiv);
    }

    // Function for handling what happens when the delete button is pressed
    // function handleDeleteButtonPress() {
    //     var listItemData = $(this).parent("td").parent("tr").data("passenger");
    //     var id = listItemData.id;
    //     $.ajax({
    //             method: "DELETE",
    //             url: "/api/passengers/" + id
    //         })
    //         .then(getPassengers);
    // }
});