import * as jwt from "jsonwebtoken";
const signToken = (id) => jwt.sign({ id }, "the jwt secret", {
    expiresIn: "66d",
});
const sendAuthToken = (user, statusCode, res) => {
    const token = signToken(user._id.toString());
    const cookieOptions = {
        expires: Date(),
        httpOnly: true,
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
export { sendAuthToken };
