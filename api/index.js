import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

// Routes
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
dotenv.config();

mongoose
	.connect(
		"mongodb+srv://darkshark:Phamlocan1106@mern-estate.5pk2h3s.mongodb.net/?retryWrites=true&w=majority"
	)
	.then(() => {
		console.log("Connected to MongoDB successfully!");
	})
	.catch((err) => {
		console.log(err);
	});

const app = express();

app.use(express.json()); // Allow send json data

const port = 3000;

app.listen(port, () => {
	console.log(`Server is listening on ${port}!`);
});

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);

app.use((err, req, res, next) => {
	const statusCode = err.statusCode || 500;
	const message = err.message || "Interal Server Error";
	return res.status(statusCode).json({
		success: false,
		statusCode,
		message,
	});
});
