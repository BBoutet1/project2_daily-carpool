$(document).ready(function() {


    $("#signIn").on("submit", displayUser);

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


                    if (inputName == userName && inputOrigin == userOrigin && inputType == userType) {
                        isUser = true;
                        $("#welcome").html("Welcome " + userName + "!");
                        $("#origin").html(userOrigin);
                        $("#dest").html(userDestination);
                        $("#signIn").css("display", "none")
                        $(".profile").css("display", "block")
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

});