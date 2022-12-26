// Controller for user

import bcrypt from 'bcryptjs';
import { Request, Response } from "express";
import { User } from "../models/userModel.js";
import { jwtIsValid, sendAuthToken, verifyJwt } from './authController.js';


// Later, we will need authentication when creating a new user.
async function createUser(
  req: Request,
  res: Response,
  next: Function
): Promise<void> {
  try {
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
    console.log(error.message);
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

    // Create a new object and remove all sensitive information
    const userObject: any = receivedUser.toObject();
    delete userObject.hashedPassword;
    delete userObject.salt;

    res
      .status(200)
      .json({
        data: "Found user!",
        user: userObject
      });
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

    // Ensure hashes match
    if (user!.hashedPassword == newHash) {
      // This will handle the JWT auth
      const user = await User.findOne({ email });

      if (req.cookies.jwt || req.body.token) return;
      // If there isn't a 'jwt' cookie, then create one
      await sendAuthToken(user, 200, res);
    } else throw new Error("Invalid password");
  } catch (error: any) {
    res
      .status(400)
      .json({ error: "Couldn't find user: " + error.message });
    next();
  }
}

async function updateJwt(
  req: Request,
  res: Response,
  next: Function
): Promise<void> {
  try {
    const { userId } = req.body;
    const foundUser = await User.findOne({ _id: userId });

    if (!foundUser) throw new Error("User ID invalid or doesn't exist");
    await sendAuthToken(foundUser, 200, res);
  } catch (error: any) {
    res
      .status(400)
      .json({ error: "Error: " + error.message });
    next();
  }
}



async function userVerify(
  req: Request,
  res: Response,
  next: Function
): Promise<void> {
  try {
    verifyJwt(req, res);
  } catch (error: any) {
    res
      .status(400)
      .json({ error: error.message, isValid: false });
    next(error);
  }
}



async function getId(
  req: Request,
  res: Response,
  next: Function
) {
  try {
    const decodedToken: any = jwtIsValid(req.cookies.jwt);
    if (decodedToken) {
      res
        .status(200)
        .json({ userId: decodedToken.id });
    }
  } catch (error: any) {
    res
      .status(400)
      .json({ error: error.message });
    next(error)
  }
}


export {
  createUser,
  getUser,
  updateUser,
  deleteUser,
  userExists,
  userVerify,
  getId,
  updateJwt
};
