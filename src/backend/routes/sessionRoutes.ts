import express from "express";

import {
  createSession,
  getSession,
  updateSession,
  deleteSession,
} from "../controllers/sessionController.js";

const router = express.Router();

// POST requests
router.route("/session/create").post(createSession);

// GET requests
router.route("/session/get").get(getSession);

// PATCH requests
router.route("/session/update").patch(updateSession);

// DELETE requests
router.route("/session/delete").delete(deleteSession);

export default router;
