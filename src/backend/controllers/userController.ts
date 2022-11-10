// Controller for user

import { Request, Response } from "express";
import { User } from "../models/userModel";


// Later, we will need authentication when creating a new user.
async function createUser(
  req: Request,
  res: Response,
  next: Function
): Promise<void> {
  try {
    const { name, email, congregation } = req.body;

    // Validate fields
    const userInvalid = !name || !email || !congregation;
    if (userInvalid) throw new Error('One or more fields are missing.');

    const createdUser = User.create({
      name,
      email,
      congregation,
    });
    res
      .status(200)
      .json({ data: "Created session.", user: createdUser });
  } catch (error: any) {
    res.status(400).json({ error: "Invalid user fields: " + error.message });
  }
}


async function getUser(
  req: Request,
  res: Response,
  next: Function
): Promise<void> {
  // Write code here...
}


async function updateUser(
  req: Request,
  res: Response,
  next: Function
): Promise<void> {
  // Write code here...
}


async function deleteUser(
  req: Request,
  res: Response,
  next: Function
): Promise<void> {
  // Write code here...
}


export {
  createUser,
  getUser,
  updateUser,
  deleteUser
};