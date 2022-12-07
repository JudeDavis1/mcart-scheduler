import jwt from "jsonwebtoken";
import { Request, Response } from "express";


// TODO:
// - Check if user has already got a JWT, then let them through.

const signToken = (id: string): string | any => jwt.sign(
  { id }, process.env.JWT_SECRET!, {
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
    httpOnly: true,
    expires: false
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

const verifyJwt = (req: Request, res: Response): any => {
const jwtSubject = req.cookies.jwt;
  if (!jwtSubject) throw Error('JWT invalid');

  // NOTE: Console will throw an error if the JWT is invalid
  const verifiedJwt: any = jwt.verify(jwtSubject, process.env.JWT_SECRET!);
  res
    .status(200)
    .json({ isValid: true });
  
  return verifiedJwt;
}


export { sendAuthToken, verifyJwt };
