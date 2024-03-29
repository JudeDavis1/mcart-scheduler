// Controller for Session

import { Session } from "../models/sessionModel.js";
import { Request, Response } from "express";
import { User } from "../models/userModel.js";
import mongoose from "mongoose";


type ObjectId = mongoose.Types.ObjectId;

// Checks if the session has the same time as any others in the database
async function hasExistingTime(
  sessionTime: number
): Promise<boolean> {
  const sessionsWithTime = await Session.find({ time: sessionTime });
  return Boolean(sessionsWithTime.length);
}

async function createSession(
  req: Request,
  res: Response,
  next: Function
): Promise<void> {
  try {
    // time: milliseconds since 1970
    const { place, members, time } = req.body;
    if (await hasExistingTime(parseInt(time)))
      throw new Error("An appointment at this time already exists!");
    
    // Validate session attributes
    const sessionInvalid = !place || !members || !time;
    if (sessionInvalid) throw new Error("Please fill out all fields");
    
    // Get IDs if exists, or return null otherwise
    const getId = async (name: string): Promise<ObjectId | null> => {
      const user = await User.findOne({ name });
      return user?._id ? user?._id : null;
    };
    // If id is not null, add that to the array
    let hasNull: boolean = false;
    let userIds: Array<ObjectId> = [];
    for (let name of members) {
      const id = await getId(name);
      if (id) userIds.push(id);
      else hasNull = true;
    }

    if (hasNull)
      throw new Error("One or more publishers don't exist");
    if (userIds.length < 2)
      throw new Error("Must be 2 or more members");

    // Convert milliseconds to a Date object
    const timeObj = new Date();
    timeObj.setTime(parseInt(time));

    const createdSession = await Session.create({
      place: place,
      members: userIds,
      time: timeObj
    });

    // Add session to the users collection
    Session.findOne({ _id: createdSession._id })
    .populate("members")
    .exec((err, session) => {
      if (err) console.log(err.message);
      // Push created session to each user in the 'members' array
      session?.members.forEach(async (member: any) => {
        await User.findOneAndUpdate(
          { _id: member._id },
          { $push: { sessions: session._id } }
        );
      });
    });

    res
      .status(200)
      .json({ data: "Created session.", session: createdSession });
  } catch (error: any) {
    res
      .status(400)
      .json({ error: "Couldn't create session. " + error.message });
    next(error);
  }
}

async function getSession(
  req: Request,
  res: Response,
  next: Function
): Promise<void> {
  try {
    const { sessionId } = req.query;
    if (!sessionId) throw new Error("Invalid ID");

    const session = await Session.findById(sessionId);
    if (!session) throw new Error("Data doesn't exist!");

    res
      .status(200)
      .json({ data: "Found session!", session: session.toJSON() });
  } catch (error: any) {
    res
      .status(400)
      .json({ error: "Error receiving data: " + error.message });
    next(error);
  }
}


async function updateSession(
  req: Request,
  res: Response,
  next: Function
): Promise<void> {
  try {
    // Request should be in the format:
    // { _id: ..., updates: { ... } }
    const { sessionId, updates } = req.body;
    if (!updates) throw new Error("Invalid updates");

    await Session.updateOne({ _id: sessionId }, updates);
    const updatedSession = await Session.findById(sessionId);
    res
      .status(200)
      .json({ data: "Successfully updated session", session: updatedSession });
  } catch (error: any) {
    res
      .status(400)
      .json({ error: "Couldn't edit session: " + error.message });
    next(error);
  }
}


async function deleteSession(
  req: Request,
  res: Response,
  next: Function
): Promise<void> {
  try {
    // Request should be in the format:
    const { sessionId } = req.query;
    if (!sessionId) throw new Error("Invalid ID");
    
    const session = await Session.findById(sessionId).populate("members");
    if (!session) throw new Error("Session doesn't exist");
    
    // For each user in the session members,
    // we need to remove the id from the 'sessions' attribute
    session.members.forEach(async (user: any) => {
      // Filter the sessionId and add the new sessions to the user
      const userSessions = user.sessions.filter(
        (val: ObjectId) => val.toString() != session._id.toString()
      );
      await User.findByIdAndUpdate(user._id, { sessions: userSessions });
    });
    await Session.findByIdAndDelete(sessionId);

    res
      .status(200)
      .json({ data: "Successfully deleted session" });
  } catch (error: any) {
    res
      .status(400)
      .json({ error: "Couldn't delete session: " + error.message });
    next(error);
  }
}


export {
  createSession,
  getSession,
  updateSession,
  deleteSession,
};
