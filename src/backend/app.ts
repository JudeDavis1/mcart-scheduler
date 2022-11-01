import * as dotenv from "dotenv";
dotenv.config();

import express from "express";


const app = express();

// Route endpoints
app.use("/api/v1/", bibleVerseRouter);


// exporting express app so it can be used by other modules
export default app;
