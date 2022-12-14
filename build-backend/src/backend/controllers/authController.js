import jwt from "jsonwebtoken";
const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "66d",
});
const sendAuthToken = (user, statusCode, res) => {
    const token = signToken(user._id.toString());
    const cookieOptions = {
        httpOnly: true,
        expires: false
    };
    if (process.env.NODE_ENV === "production")
        cookieOptions.secure = true;
    res
        .status(statusCode)
        .cookie("jwt", token, cookieOptions)
        .json({
        status: "success",
        data: { user },
        exists: true
    });
};
const verifyJwt = (req, res) => {
    const jwtSubject = req.cookies.jwt;
    if (!jwtSubject)
        throw Error('JWT invalid');
    const verifiedJwt = jwt.verify(jwtSubject, process.env.JWT_SECRET);
    res
        .status(200)
        .json({ isValid: true });
    return verifiedJwt;
};
export { sendAuthToken, verifyJwt };
