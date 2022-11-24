// Controller for user

import bcrypt from 'bcryptjs';
import { Request, Response } from "express";
import { User, UserType } from "../models/userModel.js";


// Later, we will need authentication when creating a new user.
async function createUser(
  req: Request,
  res: Response,
  next: Function
): Promise<void> {
  try {
    console.log("HEKFHEKH");
    const { name, email, congregation, hashedPassword, ...rest } = req.body;
    if (await User.exists({ email })) throw new Error("User with this email already exists!");

    // Validate fields
    const userInvalid = !name || !email || !congregation;
    if (userInvalid) throw new Error("One or more fields are missing.");
    
    const salt = await bcrypt.genSalt();
    const bcrytedPassword = await bcrypt.hash(hashedPassword, salt);
    const createdUser = await User.create({
      name,
      email,
      congregation,
      hashedPassword: bcrytedPassword,
      salt,
      ...rest
    });
    res
      .status(200)
      .json({ data: "Account created successfully!", user: createdUser });
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
    const { userId } = req.query;
    
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

    await User.updateOne({ _id: userId }, updates);
    const updatedUser = await User.findById(userId);
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
  try {
    const { userId } = req.query;
    if (!userId) throw new Error("Please provide a user ID.");

    const deletedUser = await User.deleteOne({ _id: userId });
    res
      .status(200)
      .json({ data: "Deleted user successfully!", user: deletedUser });
  } catch (error: any) {
    res
      .status(400)
      .json({ error: "Error deleting user: " + error.message });
    next();
  }
}


async function userExists(
  req: Request,
  res: Response,
  next: Function
): Promise<void> {
  try {
    const { email, hashedPassword } = req.body;
    if (!email || !hashedPassword) throw new Error("Provide an email + password please.");

    const userId = await User.exists({ email });
    if (!userId) {
      // The user does not exist
      res
        .status(200)
        .json({ exists: false });
      return;
    }
    const user = await User.findById(userId);
    const newHash = await bcrypt.hash(hashedPassword, user!.salt);

    // Ensure hashes match.
    if (user!.hashedPassword == newHash) {
      res
        .status(200)
        .json({ exists: true });
    } else throw new Error("Invalid password");
  } catch (error: any) {
    res
      .status(400)
      .json({ error: "Couldn't find user: " + error.message });
    next();
  }
}


export {
  createUser,
  getUser,
  updateUser,
  deleteUser,
  userExists
};
