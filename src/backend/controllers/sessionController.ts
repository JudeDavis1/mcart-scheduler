// Controller for Session

import Session from "../models/sessionModel.js";
import { Request, Response } from "express";

async function getSession(
  req: Request,
  res: Response,
  next: Function
): Promise<void> {
  // Write code here
}

async function createSession(
  req: Request,
  res: Response,
  next: Function
): Promise<void> {
  try {
    // time: milliseconds since 1970
    const { place, members, time } = JSON.parse(String(req.params));

    // Validate session attributes
    const sessionInvalid = !place || !members || !time;
    if (sessionInvalid) {
      res.status(400).json({ error: "Invalid request!" });
      return;
    }

    Session.create({
      place,
      members,
      time
    }).then(() => {
      res.status(200).json({ data: "Created session" });
      next();
    });
  } catch (error) {
    res.status(400).json({ error: "Couldn't create session!" });
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
