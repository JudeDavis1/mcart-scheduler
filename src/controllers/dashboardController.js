import axios from "axios";

import config from "../config.js";


function getUserInfo() {
    let userId = '';

    axios.get(config.backend_url + '/user/getId', config.withCookies)
    .then(async (val) => {
        userId = val.data.userId;
        const userData = await axios.get(config.backend_url + 'user/get?userId=' + userId);
        const user = userData.data.user;
        console.log(user);
    })
    .catch((err) => {
        if (err) return;
    });
}


export {
    getUserInfo
};
