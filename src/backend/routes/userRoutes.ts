// Route for user

import express from "express";
import {
    createUser,
    getUser,
    updateUser,
    deleteUser
} from '../controllers/userController.js';

import { verifyUser } from "../controllers/authController.js";


const router = express.Router();

// Make sure that the verifyUser function FINSIHES then goes to execute the other middlewares

router.route("/user/create").post(verifyUser, createUser);
router.route("/user/get").get(verifyUser, getUser);
router.route("/user/update").patch(verifyUser, updateUser);
router.route("/user/delete").delete(verifyUser, deleteUser);


export default router;
