import express from "express";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config();

// Route objects
import userRoutes from "./routes/userRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";

// For testing
import { ISession, Session } from "./models/sessionModel.js";


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
	})
	.then(() => {
		console.log('Connected to MongoDB cluster.');

		// Session.create({
		//     place: 'place',
		//     members: ['member1', 'member2'],
		//     time: new Date()
		// });

		// Session.findOne({place: 'place'}, (err: Error, session: ISession) => {
		//     console.log(session.place);
		// });
	});

// Route endpoints
app.use("/api/v1/", userRoutes);
app.use("/api/v1/", sessionRoutes);

// Listen without blocking the testing process
async function listenAsync() {
	app.listen(4444, () => {
		console.log("[*] Test server initialized.");
	})
};

export {
	app,
	listenAsync
};
