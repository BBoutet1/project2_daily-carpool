const axios = require("axios");

const time = {
    async getDuration(origin, destination, waypoints) {
        try {
            let durationSec = 0;
            const { data } = await axios.get(
                `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&waypoints=${waypoints}&region=ca&key=AIzaSyDXes9rc5Lm0f5N-D5M1lZO3ShcRCJPWk8`
            );
            const legs = data.routes[0].legs;
            for (let i = 0; i < legs.length; i++) {
                durationSec += legs[i].duration.value;
            }
            console.log(durationSec);
            return durationSec;
        } catch (err) {
            console.log(err);
        }
    },
};

const origin = "L7A 0W6";
const destination = "L4W 2S5";
const noWaypoint = ""
const waypoints = "L7A 3P6|L6T 4P8";
let directDurationSec, directDuration;
let poolDurationSec, poolDuration;
let timeDifferenceSec, timeDifference;

async function getD() {
    // Time in seconds
    directDurationSec = await time.getDuration(origin, destination, noWaypoint);
    poolDurationSec = await time.getDuration(origin, destination, waypoints);
    timeDifferenceSec = await poolDurationSec - directDurationSec;
    //-----------------------------------------------------------------
    // Time in hours and minutes
    directDuration = await timeConversion(directDurationSec);
    poolDuration = await timeConversion(poolDurationSec);
    timeDifference = await timeConversion(timeDifferenceSec);
}
getD()

async function timeConversion(time) {
    // Converting seconds in hours and minutes
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const duration = hours + " hours " + minutes + " minutes"
    console.log(duration)
    return duration;
}


// Calling the upsertDriver function and passing in the value of the name input
upsertDriver({
    name: "",
    homeAddress: origin,
    workAddress: destination,
    email: "",
    waypoints: waypoints,
    directDuration: directDuration,
    poolDuraction: poolDuration,
    timeDifference: timeDifference,
    passagenrNumber: 0,
});

// A function for creating an driver. Calls getDrivers upon completion
function upsertDriver(driverData) {
    // $.post("/api/drivers", driverData)
    //     .then(getDrivers);
}


module.exports = time;