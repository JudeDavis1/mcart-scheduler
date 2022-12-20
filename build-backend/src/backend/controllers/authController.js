import jwt from "jsonwebtoken";
const signToken = (obj) => jwt.sign({ obj }, process.env.JWT_SECRET, {
    expiresIn: "66d",
});
const sendAuthToken = (user, statusCode, res) => {
    const token = signToken(user.toJSON());
    const cookieOptions = {
        httpOnly: true,
        expires: false,
        sameSite: 'none',
        secure: true
    };
    if (process.env.NODE_ENV === "production")
        cookieOptions.secure = true;
    console.log("SETTING COOKIE");
    res
        .status(statusCode)
        .cookie("jwt", token, cookieOptions)
        .json({
        status: "success",
        data: { user },
        exists: true,
        token: token
    });
};
const jwtIsValid = (jwtSubject) => {
    try {
        const verifiedJwt = jwt.verify(jwtSubject, process.env.JWT_SECRET);
        return verifiedJwt;
    }
    catch (err) {
        return false;
    }
};
const verifyJwt = (req, res) => {
    const jwtSubject = req.cookies.jwt ? req.cookies.jwt : req.query.jwt;
    console.log(jwtSubject);
    if (!jwtSubject)
        throw Error('JWT invalid');
    const verifiedJwt = jwt.verify(jwtSubject, process.env.JWT_SECRET);
    res
        .status(200)
        .json({ isValid: true, user: verifiedJwt.obj });
    return verifiedJwt;
};
export { sendAuthToken, verifyJwt, jwtIsValid };
