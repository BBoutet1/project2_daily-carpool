const axios = require("axios");

const time = {

    async getDuration(origin, destination, waypoints) {
        try {
            //const origin = "L7A 0W6";
            //const destination = "L4W 2S5";
            //const waypointsArray = ["L7A 3P6", "L6T 4P8"]
            // let waypoints = ""
            // for (let i = 0; i < waypointsArray.length; i++) { waypoints = waypoints + "|" + waypointsArray[i] };
            let durationSeconds = 0;
            const { data } = await axios.get(
                `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&waypoints=${waypoints}&region=ca&key=AIzaSyDXes9rc5Lm0f5N-D5M1lZO3ShcRCJPWk8`
            );
            const legs = data.routes[0].legs;
            for (let i = 0; i < legs.length; i++) {
                durationSeconds += legs[i].duration.value;
            }
            console.log(durationSeconds);

            return durationSeconds;
        } catch (err) {
            console.log(err);
        }
    },
};
async function getD() {
    const origin = "L7A 0W6";
    const destination = "L4W 2S5";
    const waypoints = "L7A 3P6|L6T 4P8";
    var dur = await time.getDuration(origin, destination, waypoints)
    console.log(dur)
}
getD()

module.exports = time;