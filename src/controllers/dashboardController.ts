import axios from "axios";

import config from "../config";
import { getUser } from "./jwtController";
import { IUser } from "../backend/models/userModel.js";


interface SessionInfo {
    time: number;
    place: string;
    members: Array<string>;
}

async function getUserInfo(): Promise<IUser> {
    const user = await getUser();
    return user;
}

async function didTapCreateAppointment(
    info: SessionInfo
): Promise<boolean> {
    // Create the session
    console.log(info)
    const request = await axios.post(config.backend_url + '/session/create', info);
    const createdSession = request.data.session;
    console.log(createdSession)
    if (createdSession) {
        return true;
    }
    return false;
}


export {
    getUserInfo,
    didTapCreateAppointment
};
