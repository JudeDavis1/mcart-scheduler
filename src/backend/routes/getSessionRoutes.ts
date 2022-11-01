import express from "express";

import routeHandler from '../controllers/getSessionController.js';

const router = express.Router();
router.use("/getSession/:session", routeHandler);

export default router;
