import express from "express";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config();
import userRoutes from "./routes/userRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
const app = express();
const db = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@cluster0.mdm9nru.mongodb.net/?retryWrites=true&w=majority`;
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
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
