import mongoose from "mongoose";
import * as dotenv from "dotenv";
import cookieParser from "cookie-parser";
import express from "express";
dotenv.config();
import userRoutes from "./routes/userRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
const app = express();
const db = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@cluster0.mdm9nru.mongodb.net/?retryWrites=true&w=majority`;
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", req.header('Origin'));
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "*");
    next();
});
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
mongoose.connect(db)
    .catch((error) => {
    if (error) {
        console.log(error.message);
        console.log('Error connecting to MongoDB cluster!');
        process.exit(-1);
    }
});
app.use("/api/v1/", userRoutes);
app.use("/api/v1/", sessionRoutes);
async function listenAsync(port = 3001) {
    return app.listen(port, () => {
        console.log("[*] Test server initialized.");
    });
}
;
export { app, listenAsync };
