$(document).ready(function() {
    // Getting references to the name input and passenger container, as well as the table body
    firstName = $("#firstName");
    lastName = $("#lastName");
    userName = $("#userName");
    driverOrigin = $("#origin");
    driverDestination = $("#destination");
    let userAccepted = true;

    // Adding event listeners to the form to create a new object, and the button to delete
    // an Passenger
    $("#passenger-form").on("submit", handlePassengerFormSubmit);

    // A function to handle what happens when the form is submitted to create a new Passenger
    function handlePassengerFormSubmit(event) {
        event.preventDefault();
        // Getting references to the name input and passenger container, as well as the table body
        firstName = $("#firstName");
        lastName = $("#lastName");
        userName = $("#userName");
        driverOrigin = $("#origin");
        driverDestination = $("#destination");

        // Don't do anything if the name fields hasn't been filled out
        if (!firstName.val().trim() || !lastName.val().trim() || !userName.val().trim() || !driverOrigin.val().trim() || !driverDestination.val().trim()) {
            alert("Form not completed. Please fill up the form!")
            return;
        }

        let queryURL = "/api/passengers";
        $.ajax({
                url: queryURL,
                method: "GET"
            })
            .then(function(response) {
                for (let i = 0; i < response.length; i++) {
                    if (userName.val().trim() == response[i].userName) {
                        alert(`User name ${userName.val().trim()} already exist. Register with another user name`);
                        return;
                    }
                }
                // Calling the insertDriver function and passing in values of driver parameters
                insertPassenger({
                    firstName: firstName.val().trim(),
                    lastName: lastName.val().trim(),
                    userName: userName.val().trim(),
                    homeAddress: driverOrigin.val().trim(),
                    workAddress: driverDestination.val().trim(),
                    type: "Driver"
                });
                alert(`Passenger profile created for ${firstName.val().trim()}  ${lastName.val().trim()}. Do not forget to record your user name: ${userName.val().trim()}`)
            })
    }


    // A function for creating an passenger. Calls getPassengers upon completion
    function insertPassenger(passengerData) {
        $.post("/api/passengers", passengerData)
    }

});