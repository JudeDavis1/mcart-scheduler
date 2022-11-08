import express from "express";

import {
  getSession,
  createSession,
  editSession,
} from "../controllers/sessionController.js";

const router = express.Router();

// POST requests
router.route("/createSession").post(createSession);

// GET requests
router.route("/getSession").get(getSession);

// PATCH requests
router.route("/editSession").patch(editSession);

export default router;
