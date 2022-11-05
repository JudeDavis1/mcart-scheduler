import express from "express";
import { getSession, createSession, editSession, } from "../controllers/sessionController.js";
const router = express.Router();
// GET requests
router.route("/getSession/:session").get(getSession);
// POST requests
router.route("/createSession/:session").post(createSession);
// PATCH requests
router.route("/editSession/:session").patch(editSession);
export default router;
