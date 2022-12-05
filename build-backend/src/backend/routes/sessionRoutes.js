import express from "express";
import { createSession, getSession, updateSession, deleteSession, } from "../controllers/sessionController.js";
const router = express.Router();
router.route("/session/create").post(createSession);
router.route("/session/get").get(getSession);
router.route("/session/update").patch(updateSession);
router.route("/session/delete").delete(deleteSession);
export default router;
