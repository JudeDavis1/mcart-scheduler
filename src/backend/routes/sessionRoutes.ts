import express from "express";

import {
  createSession,
  getSession,
  updateSession,
  deleteSession,
} from "../controllers/sessionController.js";

const router = express.Router();

// POST requests
router.route("/createSession").post(createSession);

// GET requests
router.route("/getSession").get(getSession);

// PATCH requests
router.route("/updateSession").patch(updateSession);

// DELETE requests
router.route("/deleteSession").delete(deleteSession);

export default router;
