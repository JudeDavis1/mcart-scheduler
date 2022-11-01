import express from "express";
import * as dotenv from "dotenv";
dotenv.config();

// Route objects
import getSession from "./routes/getSessionRoutes";


const app = express();

// Route endpoints
app.use("/api/v1/", getSession);


// exporting express app so it can be used by other modules
export default app;
