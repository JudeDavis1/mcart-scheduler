import axios from "axios";
import config from "../config";
async function getUserFromId(id) {
    let response;
    try {
        response = await axios.get(config.backend_url + "/user/get?userId=" + id);
    }
    catch (error) {
        console.log(error);
    }
    return response.data.user;
}
export { getUserFromId };
