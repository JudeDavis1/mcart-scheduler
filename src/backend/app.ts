import express from "express";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config();

// Route objects
import userRoutes from "./routes/userRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";


const app = express();
const db = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@cluster0.mdm9nru.mongodb.net/?retryWrites=true&w=majority`;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(db)
	.catch((error: Error) => {
		if (error) {
			console.log(error.message);
			console.log('Error connecting to MongoDB cluster!');

			process.exit(-1);
		}
	});

// Route endpoints
app.use("/api/v1/", userRoutes);
app.use("/api/v1/", sessionRoutes);

// Listen without blocking the testing process
async function listenAsync(port: number = 3001) {
	return app.listen(port, () => {
		console.log("[*] Test server initialized.");
	});
};

export {
	app,
	listenAsync
};
