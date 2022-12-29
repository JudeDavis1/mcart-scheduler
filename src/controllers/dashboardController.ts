import axios, { AxiosResponse } from "axios";

import config from "../config";
import { getUser, updateUser, deleteJwt } from "./jwtController";
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
  info: SessionInfo,
  msg: Object,
  msgFn: Function,
  done: Function
): Promise<void> {
  // Add the current user to the members
  const user = await getUser();
  info.members.push(user.name);
  info.members = info.members.map(toTitleCase);
  // Create the session
  let response: AxiosResponse;
  try {
    response = await axios.post(config.backend_url + '/session/create', info);
    const createdSession = response.data.session;
    await updateUser();

    setTimeout(() => done(), 700);
  } catch (error: any) {
    msgFn({...msg, text: error.response.data.error, shouldShow: true, status: "danger"});
    console.error(error.response.data.error);
    return;
  }

  msgFn({ ...msg, text: "Successfully created session", shouldShow: true, status: "success" });
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

async function deleteSessionItem(sessionId: string, reloadFn: Function) {
  console.log(sessionId)
  const request = await axios.delete(
    config.backend_url + "/session/delete?sessionId=" + sessionId
  );
  
  await updateUser();
  reloadFn(Date.now());
}

function logout() {
  deleteJwt();
  window.location.href = '/';
}

export {
  getUserInfo,
  didTapCreateAppointment,
  getSession,
  getUserFromSession,
  loadSessions,
  deleteSessionItem,
  logout
};
