// Route for user

import express from "express";
import {
    createUser,
    getUser,
    updateUser,
    deleteUser,
    userExists,
    userVerify
} from '../controllers/userController.js';

// import { verifyUser } from "../controllers/authController.js";


const router = express.Router();

// Make sure that the verifyUser function FINSIHES then goes to execute the other middlewares

router.route("/user/create").post(createUser);
router.route("/user/get").get(getUser);
router.route("/user/update").patch(updateUser);
router.route("/user/delete").delete(deleteUser);
router.route("/user/exists").post(userExists);
router.route("/user/verify").get(userVerify);


export default router;
