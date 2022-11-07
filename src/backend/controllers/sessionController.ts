// Controller for Session

import { Session } from "../models/sessionModel.js";
import { Request, Response } from "express";

async function getSession(
  req: Request,
  res: Response,
  next: Function
): Promise<void> {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      res.status(400).json({ error: "That ID is not valid" });
      throw new Error("Invalid ID");
    }

    const session = await Session.findById(sessionId);

    if (!session) {
      res.status(400).json({ error: "Data doesn't exist" });
      throw new Error("No data returned!");
    }
  } catch (error) {
    next(error);
  }
}

async function createSession(
  req: Request,
  res: Response,
  next: Function
): Promise<void> {
  try {
    // time: milliseconds since 1970
    const { place, members, time } = req.body;
    console.log(place, members, time);

    // Validate session attributes
    const sessionInvalid = !place || !members || !time;
    if (sessionInvalid) throw new Error("Invalid session");

    const timeObj = new Date();
    timeObj.setTime(parseInt(time));

    await Session.create({
      place: place,
      members: members,
      time: timeObj
    });

    res.status(200).json({ data: "Created session" });
  } catch (error) {
    res
      .status(400)
      .json({ error: "Couldn't create session. Try checking your data." });
    next(error);
    return;
  }
}

async function editSession(
  req: Request,
  res: Response,
  next: Function
): Promise<void> {
  // Write code here
}

export { getSession, createSession, editSession };
