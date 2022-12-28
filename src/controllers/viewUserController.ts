import axios, { AxiosResponse } from "axios";
import config from "../config";


async function getUserFromId(id: string) {
    let response: AxiosResponse;
    try {
        response = await axios.get(config.backend_url + "/user/get?userId=" + id);
    } catch (error: any) { console.log(error) }

    return response!.data.user;
}

export {
    getUserFromId
}