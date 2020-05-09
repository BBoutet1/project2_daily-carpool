const axios = require("axios");

const api = {
    async getUser(origin, destination) {
        try {
            const { data } = await axios.get(
                `https://maps.googleapis.com/maps/api/directions/json?${origin}=Toronto&destination=Ottawa&region=ca&key=AIzaSyDXes9rc5Lm0f5N-D5M1lZO3ShcRCJPWk8`
            );
            console.log(data.routes[0].bounds)
        } catch (err) {
            console.log(err);
        }
    },
};

api.getUser()




module.exports = api;