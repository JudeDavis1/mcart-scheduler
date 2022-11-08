import express from "express";

import {
  createSession,
  getSession,
  editSession,
  deleteSession,
} from "../controllers/sessionController.js";

const router = express.Router();

// POST requests
router.route("/createSession").post(createSession);

// GET requests
router.route("/getSession").get(getSession);

// PATCH requests
router.route("/editSession").patch(editSession);

// DELETE requests
router.route("/deleteSession").delete(deleteSession);

export default router;
