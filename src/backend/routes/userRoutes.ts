// Route for user

import express from "express";
import {
    createUser,
    getUser,
    updateUser,
    deleteUser
} from '../controllers/userController.js';


const router = express.Router();

router.route("/user/create").post(createUser);
router.route("/user/get").get(getUser);
router.route("/user/update").patch(updateUser);
router.route("/user/delete").delete(deleteUser);


export default router;
