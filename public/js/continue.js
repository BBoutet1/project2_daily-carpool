$(document).ready(function() {

    // Getting references to the name input and user container, as well as the table body
    var userName = "";
    // var userEmail = $("#email");
    var userOrigin = "";
    var usertype = "";

    // Adding event listeners to the form to create a new object, and the button to delete
    // an Driver
    $("#continue-form").on("click", handleDriverFormSubmit);
    //$(document).on("click", ".delete-user", handleDeleteButtonPress);
    // Getting the initial list of Drivers



    // A function to handle what happens when the form is submitted to create a new Driver
    function handleDriverFormSubmit(event) {
        event.preventDefault();
        // Getting references to the name input and user container, as well as the table body

        userName = $("#name");
        // var userEmail = $("#email");
        userOrigin = $("#origin");
        var usertype = $("#userType option:selected");
        // Don't do anything if the name fields hasn't been filled out
        if (!userName.val().trim() || !userOrigin.val().trim()) {
            return;
        }
        var usertype = usertype.val();
        setTimeout(function timer() {
            $("#userType").html(usertype);
        }, 2000);
        $("#userType").html(usertype);
        if (usertype == "Driver") {

        }
        if (usertype == "Passenger") {

        }
    }
});
