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
                // Calling the insertDriver function and passing in values of driver parameters
                insertDriver({
                    firstName: firstName.val().trim(),
                    lastName: lastName.val().trim(),
                    userName: userName.val().trim(),
                    homeAddress: driverOrigin.val().trim(),
                    workAddress: driverDestination.val().trim(),
                    type: "Driver"
                });
                alert("Driver profile created for " + firstName.val().trim() + " " + lastName.val().trim() + ". Do not forget to record your user name: " + userName.val().trim())

            })
    }

    // A function for creating an driver. Calls getDrivers upon completion
    function insertDriver(driverData) {
        console.log(driverData.firstName, driverData.lastName)
        $.post("/api/drivers", driverData)
    }

});