import axios from "axios";

import config from "../config.js";
import { IUser } from "../backend/models/userModel.js";
import { getUser } from "./jwtController";


async function getUserInfo(): Promise<IUser> {
    const user = await getUser();
    console.log(user);
    return user;
}

async function didTapCreateAppointment() {
    // const val = await axios.post(config.backend_url + '/session/create');
    console.log('SUBMIT')
}


export {
    getUserInfo,
    didTapCreateAppointment
};
