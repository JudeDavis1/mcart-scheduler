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
  // time: milliseconds since 1970
  const { place, members, time } = JSON.parse(String(req.params));

  // Validate session attributes
  const sessionInvalid = !place || !members || !time;
  if (sessionInvalid)
  {
    res.status(400).send({error: "Invalid request!"});
    return;
  }

  Session.create({
    place,
    members,
    time
  }).catch(() => {
    res.status(400).send({error: "Couldn't create session!"});
    return;
  }).then(() => {
    res.status(200).send({data: "Created session"});
    next();
  });
}

async function editSession(
  req: Request,
  res: Response,
  next: Function
): Promise<void> {
  // Write code here
}

export { getSession, createSession, editSession };
