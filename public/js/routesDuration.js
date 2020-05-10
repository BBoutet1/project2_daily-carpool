const axios = require("axios");

const time = {
    async getUser(origin, destination, waypointsArray) {
        try {
            //const origin = "L7A 0W6";
            //const destination = "L4W 2S5";
            //const waypointsArray = ["L7A 3P6", "L6T 4P8"]
            let waypoints = ""
            for (let i = 0; i < waypointsArray.length; i++) { waypoints = waypoints + "|" + waypointsArray[i] };
            let durationSeconds = 0;
            const { data } = await axios.get(
                `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&waypoints=${waypoints}&region=ca&key=AIzaSyDXes9rc5Lm0f5N-D5M1lZO3ShcRCJPWk8`
            );
            const legs = data.routes[0].legs;
            for (let i = 0; i < legs.length; i++) {
                durationSeconds += legs[i].duration.value;
            }
            // Converting seconds in hours and minutes
            const hours = Math.floor(durationSeconds / 3600);
            const minutes = Math.floor((durationSeconds % 3600) / 60);
            const duration = hours + " hours " + minutes + "minutes"
            console.log(duration);
            return durationSeconds;
        } catch (err) {
            console.log(err);
        }
    },
};
module.exports = time;