import { Request, Response } from "express";

import { User } from "./../models/userModel.js";

import * as jwt from "jsonwebtoken";

// TODO:
// - Check if user has already got a JWT, then let them through.

const signToken = (id: string): string | any => jwt.sign(
  { id }, "the jwt secret", {
  expiresIn: "66d",
});

// user is the user document
const sendAuthToken = (
  user: any,
  statusCode: number,
  res: Response
): void => {
  // generating the token with the payload (which is the user's mongodb id)
  const token: string = signToken(user._id.toString());
  const cookieOptions: any = {
    expires: Date(),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
  // Save the cookie as 'jwt'
  res
    .status(statusCode)
    .cookie("jwt", token, cookieOptions)
    .json({
      status: "success",
      data: { user },
      exists: true
    });
};


export { sendAuthToken };
