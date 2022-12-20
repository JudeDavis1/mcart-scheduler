import axios from "axios";
import config from "../config.js";
async function getUserInfo() {
    const val = await axios.get(config.backend_url + '/user/getId', config.withCookies).catch((err) => {
        if (err)
            return;
    });
    const userId = val.data.userId;
    const userData = await axios.get(config.backend_url + 'user/get?userId=' + userId);
    const user = userData.data.user;
    return user;
}
async function didTapCreateAppointment() {
    console.log('SUBMIT');
}
export { getUserInfo, didTapCreateAppointment };
