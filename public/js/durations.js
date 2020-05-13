 // Building URL to query current the 5 days forcast database
 const queryURL = "http://localhost:8080/api/drivers"
 const directDuration = "";
 const poolDuration = "";
 const timeDifference = "";
 $.ajax({
         url: queryURL,
         method: "GET"
     })
     // We store UV retrieved data inside of an object called "response2"
     .then(function(response) {
         console.log(response)
         async function driverData() {
             const directDuration = await response.directDuration;
             const poolDuration = await response.poolDuraction;
             const timeDifference = await response.timeDifference;
             console.log(directDuration);
         }
         driverData()
         $("#directTime").html(response.directDuration);
         $("#poolTime").html(response.poolDuraction);
         $("#difference").html(response.timeDifference);



     });