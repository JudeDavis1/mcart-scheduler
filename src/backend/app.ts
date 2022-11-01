import express from "express";
import * as dotenv from "dotenv";

// Route objects
import sessionRoutes from "./routes/sessionRoutes";

// dotenv parsing
dotenv.config();

const app = express();

// Route endpoints
app.use("/api/v1/", sessionRoutes);

// exporting express app so it can be used by other modules
export default app;
