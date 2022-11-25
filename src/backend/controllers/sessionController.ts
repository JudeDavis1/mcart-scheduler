// Controller for Session

import { Session } from "../models/sessionModel.js";
import { Request, Response } from "express";


async function createSession(
  req: Request,
  res: Response,
  next: Function
): Promise<void> {
  try {
    console.log('ehl;lodifhsds')
    // time: milliseconds since 1970
    const { place, members, time } = req.body;

    // Validate session attributes
    const sessionInvalid = !place || !members || !time;
    if (sessionInvalid) throw new Error("Invalid session");

    const timeObj = new Date();
    timeObj.setTime(parseInt(time));

    const createdSession = await Session.create({
      place: place,
      members: members,
      time: timeObj
    });

    res
      .status(200)
      .json({ data: "Created session.", session: createdSession });
  } catch (error) {
    res
      .status(400)
      .json({ error: "Couldn't create session. Try checking your data." });
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
    // { _id: ..., updates: { ... } }
    const { sessionId } = req.query;
    if (!sessionId) throw new Error("Invalid ID");

    await Session.deleteOne({ _id: sessionId })
    res
      .status(200)
      .json({ data: "Successfully delete session" });

  } catch (error) {
    res
      .status(400)
      .json({ error: "Couldn't delete session" });
    next(error);
  }
}


export {
  createSession,
  getSession,
  updateSession,
  deleteSession,
};
