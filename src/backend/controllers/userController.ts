// Controller for user

import { Request, Response } from "express";
import { User, UserType } from "../models/userModel";


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
    next(error);
  }
}


async function getUser(
  req: Request,
  res: Response,
  next: Function
): Promise<void> {
  try {
    const { userId } = req.body;
    if (!userId) throw new Error("Please provide a user ID.");

    const receivedUser = await User.findById(userId);
    if (!receivedUser) throw new Error("User doesn't exist.");

    res.status(200).json({ data: "Found user!", user: receivedUser });
  } catch (error: any) {
    res
      .status(400)
      .json({ error: "Error retrieving user: " + error.message });
    next();
  }
}


async function updateUser(
  req: Request,
  res: Response,
  next: Function
): Promise<void> {
  try {
    const { userId, updates } = req.body;
    if (!userId) throw new Error("Please provide a user ID.");
    if (!updates) throw new Error("Please provide updates.");

    const updatedUser = await User.updateOne({ _id: userId }, updates);
    res
      .status(200)
      .json({ data: "Updated user successfully!", user: updatedUser });
  } catch (error: any) {
    res
      .status(400)
      .json({ error: "Error updating user: " + error.message });
    next();
  }
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
