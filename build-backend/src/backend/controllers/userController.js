import bcrypt from 'bcryptjs';
import { User } from "../models/userModel.js";
import { jwtIsValid, sendAuthToken, verifyJwt } from './authController.js';
async function createUser(req, res, next) {
    try {
        const { name, email, congregation, hashedPassword, ...rest } = req.body;
        if (await User.exists({ email }))
            throw new Error("User with this email already exists!");
        const userInvalid = !name || !email || !congregation;
        if (userInvalid)
            throw new Error("One or more fields are missing.");
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
    }
    catch (error) {
        console.log(error.message);
        res.status(400).json({ error: "Invalid user fields: " + error.message });
        next(error);
    }
}
async function getUser(req, res, next) {
    try {
        const { userId } = req.query;
        if (!userId)
            throw new Error("Please provide a user ID.");
        const receivedUser = await User.findById(userId);
        if (!receivedUser)
            throw new Error("User doesn't exist.");
        res
            .status(200)
            .json({ data: "Found user!",
            user: receivedUser
        });
    }
    catch (error) {
        res
            .status(400)
            .json({ error: "Error retrieving user: " + error.message });
        next();
    }
}
async function updateUser(req, res, next) {
    try {
        const { userId, updates } = req.body;
        if (!userId)
            throw new Error("Please provide a user ID.");
        if (!updates)
            throw new Error("Please provide updates.");
        await User.updateOne({ _id: userId }, updates);
        const updatedUser = await User.findById(userId);
        res
            .status(200)
            .json({ data: "Updated user successfully!", user: updatedUser });
    }
    catch (error) {
        res
            .status(400)
            .json({ error: "Error updating user: " + error.message });
        next();
    }
}
async function deleteUser(req, res, next) {
    try {
        const { userId } = req.query;
        if (!userId)
            throw new Error("Please provide a user ID.");
        const deletedUser = await User.deleteOne({ _id: userId });
        res
            .status(200)
            .json({ data: "Deleted user successfully!", user: deletedUser });
    }
    catch (error) {
        res
            .status(400)
            .json({ error: "Error deleting user: " + error.message });
        next();
    }
}
async function userExists(req, res, next) {
    try {
        const { email, hashedPassword } = req.body;
        if (!email || !hashedPassword)
            throw new Error("Provide an email + password please.");
        const userId = await User.exists({ email });
        if (!userId) {
            res
                .status(200)
                .json({ exists: false });
            return;
        }
        const user = await User.findById(userId);
        const newHash = await bcrypt.hash(hashedPassword, user.salt);
        if (user.hashedPassword == newHash) {
            const user = await User.findOne({ email });
            await sendAuthToken(user, 200, res);
        }
        else
            throw new Error("Invalid password");
    }
    catch (error) {
        res
            .status(400)
            .json({ error: "Couldn't find user: " + error.message });
        next();
    }
}
async function updateJwt(req, res, next) {
    try {
        const { userId } = req.body;
        const foundUser = await User.findOne({ _id: userId });
        if (!foundUser)
            throw new Error("User ID invalid or doesn't exist");
        await sendAuthToken(foundUser, 200, res);
    }
    catch (error) {
        res
            .status(400)
            .json({ error: "Error: " + error.message });
        next();
    }
}
async function userVerify(req, res, next) {
    try {
        verifyJwt(req, res);
    }
    catch (error) {
        res
            .status(400)
            .json({ error: error.message, isValid: false });
        next(error);
    }
}
async function getId(req, res, next) {
    try {
        const decodedToken = jwtIsValid(req.cookies.jwt);
        if (decodedToken) {
            res
                .status(200)
                .json({ userId: decodedToken.id });
        }
    }
    catch (error) {
        res
            .status(400)
            .json({ error: error.message });
        next(error);
    }
}
export { createUser, getUser, updateUser, deleteUser, userExists, userVerify, getId, updateJwt };
