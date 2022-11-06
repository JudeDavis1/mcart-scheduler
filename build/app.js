import express from "express";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
// Route objects
import sessionRoutes from "./routes/sessionRoutes.js";
dotenv.config();
console.log(process.env.MONGODB_USER);
console.log(process.env.MONGODB_PASS);
const PORT = 3001;
const app = express();
const db = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@cluster0.mdm9nru.mongodb.net/?retryWrites=true&w=majority`;
mongoose.connect(db)
    .catch(error => {
    if (error) {
        console.log(error);
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
    console.log('Running on PORT: ' + PORT);
});
export default app;
