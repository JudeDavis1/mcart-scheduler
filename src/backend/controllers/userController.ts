// Controller for user

import { Request, Response } from "express";
import { User } from "../models/userModel";


async function createUser(
  req: Request,
  res: Response,
  next: Function
): Promise<void> {
  const { } = req.body;
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
