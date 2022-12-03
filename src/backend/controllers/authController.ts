import { Request, Response } from "express";

import { User } from "./../models/userModel.js";

import * as jwt from "jsonwebtoken";

const signToken = (id: string): string | any =>
  jwt.sign({ id }, "the jwt secret", {
    expiresIn: "1d",
  });

// user is the user document
const createSendToken = (
  user: any,
  statusCode: number,
  res: Response
): void => {
  // generating the token with the payload (which is the user's mongodb id)
  const token: string = signToken(user._id);
  const cookieOptions: any = {
    expires: Date(),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  //   hide the password
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    data: { user },
  });
};

async function login(
  req: Request,
  res: Response,
  next: Function
): Promise<void> {
  // do some validation and log the user in by sending the token
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select(+password);
  createSendToken(user, 200, res);
}

export { login };
