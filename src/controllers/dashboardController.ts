import axios from "axios";

import config from "../config.js";
import { IUser } from "../backend/models/userModel.js";


async function getUserInfo(): Promise<IUser> {
    const val = await axios.get(
        config.backend_url + '/user/getId', config.withCookies
    ).catch((err) => {
        if (err) return;
    });
    const userId = val!.data.userId;
    const userData = await axios.get(
        config.backend_url + 'user/get?userId=' + userId
    );
    const user: IUser = userData.data.user;

    return user
}


export {
    getUserInfo
};
