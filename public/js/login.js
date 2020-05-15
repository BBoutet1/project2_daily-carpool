$(document).ready(function() {


    $("#continue-form").on("submit", displayUser);

    function displayUser(event) {
        event.preventDefault();


        const inputName = $("#userName").val().trim();
        const inputOrigin = $("#userOrigin").val().trim();
        const inputType = $("#userType option:selected").val();

        let userName = "";
        let userOrigin = "";
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
                    userType = response[i].type;
                    console.log(inputName, inputOrigin, inputType)
                    console.log(userName, userOrigin, userType)
                    console.log(inputName == userName)
                    console.log(inputOrigin == userOrigin)
                    console.log(inputType == userType)
                    if (inputName == userName && inputOrigin == userOrigin && inputType == userType) {
                        console.log(isUser + " become")
                        $("#name").html(userName);
                        $("#origin").html(userOrigin);
                        $("#dest").html(response[2].workAddress);
                        $("#userType").html("You are a " + userType);
                        isUser = true;
                    }
                }
                // Building URL to query current the 5 days forcast database


                //$("#output").html(response[2].workAddress);
                //  let checked = ""
                //  $("input:checked").val()
                //  "";
                //  $("input").on("click", function() {
                //      // access properties using this keyword
                //      let checked = $("input:checked").val();
                //      console.log(checked)
                //      if (checked == "passenger1") {
                //          $("#poolTime").html(response.poolDuraction);
                //          $("#difference").html(response.timeDifference);
                //      } else {
                //          $("#poolTime").html("No selection");
                //          $("#difference").html("No selection");
                //      }
            }).then(function() {
                console.log(isUser + " Conclude")
                if (!isUser) {
                    $("#userName").html("User " + userName + " from " + userOrigin + " does not exist");
                    alert("User " + userName + " from " + userOrigin + " does not exist")
                }
            });

    }



    //  });
    //  });       
});