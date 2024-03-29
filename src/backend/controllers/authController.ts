import jwt from "jsonwebtoken";
import { Request, Response } from "express";


// TODO:
// - Check if user has already got a JWT, then let them through.

const signToken = (obj: string): string | any => jwt.sign(
  { obj }, process.env.JWT_SECRET!, {
  expiresIn: "66d",
});

// user is the user document
const sendAuthToken = (
  user: any,
  statusCode: number,
  res: Response
): void => {
  // generating the token with the payload (user as json)
  const token: string = signToken(user.toJSON());
  const cookieOptions: any = {
    httpOnly: false,
    expires: false,
    sameSite: 'none',
    secure: true
  };

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
  // Save the cookie as 'jwt'
  res
    .status(statusCode)
    .clearCookie("jwt")
    .cookie("jwt", token, cookieOptions)
    .json({
      status: "success",
      data: { user },
      exists: true,
      token: token
    });
};

const jwtIsValid = (jwtSubject: string): boolean => {
  try {
  const verifiedJwt: any = jwt.verify(jwtSubject, process.env.JWT_SECRET!);
  return verifiedJwt;
  } catch (err) {
    return false;
  }
}

const verifyJwt = (req: Request, res: Response): any => {
  const jwtSubject = req.cookies.jwt ? req.cookies.jwt : req.query.jwt;
  if (!jwtSubject) throw Error('JWT invalid');

  // NOTE: Console will throw an error if the JWT is invalid
  const verifiedJwt: any = jwt.verify(jwtSubject, process.env.JWT_SECRET!);
  res
    .status(200)
    .json({ isValid: true, user: verifiedJwt.obj });
  
  return verifiedJwt;
}


export { sendAuthToken, verifyJwt, jwtIsValid };
