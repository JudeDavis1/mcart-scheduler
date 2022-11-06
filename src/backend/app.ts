import express from "express";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config();

// Route objects
import sessionRoutes from "./routes/sessionRoutes.js";
import Session from "./models/sessionModel.js";


const PORT = 3001;
const app = express();
const db = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@cluster0.mdm9nru.mongodb.net/?retryWrites=true&w=majority`;

// Middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));

mongoose.connect(db)
.catch((error: Error) => {
    if (error)
    {
        console.log(error.message);
        console.log('Error connecting to MongoDB cluster!');
        return;
    }
})
.then(() => {
    console.log('Connected to MongoDB cluster.');
});

// Route endpoints
app.use("/api/v1/", sessionRoutes);

app.listen(PORT, () => {
    console.log('Running on PORT: ' + PORT + '.');
});


export default app;
