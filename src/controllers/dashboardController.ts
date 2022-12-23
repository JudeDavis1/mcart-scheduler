import axios from "axios";

import config from "../config";
import { getUser, updateUser } from "./jwtController";
import { IUser } from "../backend/models/userModel.js";
import { toTitleCase } from "../utils/strUtils";


interface SessionInfo {
  time: number;
  place: string;
  members: Array<string>;
}

async function getUserInfo(): Promise<IUser> {
  const user = await getUser();
  await updateUser();

  return await getUser();
}

async function didTapCreateAppointment(
  info: SessionInfo
): Promise<boolean> {
  // Add the current user to the members
  const user = await getUser();
  info.members.push(user.name);
  info.members = info.members.map(toTitleCase);
  // Create the session
  const request = await axios.post(config.backend_url + '/session/create', info);
  const createdSession = request.data.session;
  
  if (!createdSession) return false;
  
  return true;
}

async function getSession(id: string): Promise<any> {
  const request = await axios.get(
    config.backend_url + "/session/get?sessionId=" + id
  );
  return request.data.session;
}

async function getUserFromSession(id: string): Promise<IUser> {
  const request = await axios.get(
    config.backend_url + "/user/get?userId=" + id
  );
  return request.data.user;
}


async function loadSessions(info: any): Promise<any> {
  const sessionObjects = [];
  for (let sessionId of info.sessions) {
    const users = [];
    try {
      const object = await getSession(sessionId.toString());
      for (let userId of object.members) {
        users.push(await getUserFromSession(userId.toString()));
      }
      object.members = users;
      sessionObjects.push(object);
    } catch { continue };
  }

  return sessionObjects;
}

async function deleteSessionItem(sessionId: string) {
  console.log(sessionId)
  const request = await axios.delete(
    config.backend_url + "/session/delete?sessionId=" + sessionId
  );
  console.log(request.data.data);
  updateUser();
}

export {
  getUserInfo,
  didTapCreateAppointment,
  getSession,
  getUserFromSession,
  loadSessions,
  deleteSessionItem
};
