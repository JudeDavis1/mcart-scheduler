import { User } from "./../models/userModel.js";
import * as jwt from "jsonwebtoken";
const signToken = (id) => jwt.sign({ id }, "the jwt secret", {
    expiresIn: "1d",
});
const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    const cookieOptions = {
        expires: Date(),
        httpOnly: true,
    };
    if (process.env.NODE_ENV === "production")
        cookieOptions.secure = true;
    res.cookie("jwt", token, cookieOptions);
    user.password = undefined;
    res.status(statusCode).json({
        status: "success",
        data: { user },
    });
};
async function login(req, res, next) {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select(+password);
    createSendToken(user, 200, res);
}
export { login };
