import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { dbConnection } from "./database/dbConnection.js";
import userRouter from "./router/userRouter.js"
import { errormiddleWare } from "./middlewares/errorMiddeware.js";
import orderRouter from "./router/orderRouter.js";
import { mongo } from "mongoose";


const app = express();


// Serve static files from the "files" directory


// Configure environment variables
config({ path: "./config/config.env" });

app.use(cors({
  origin: [process.env.FRONTEND_URL, process.env.NGO_URL, process.env.VOLUNTEER_URL],
  methods: ["GET", "POST", "DELETE", "PUT"],
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api/v1/user", userRouter);
app.use("/api/v1/order",orderRouter);

// Configure multer for file uploads


// Set up routes


// Handle message sending


// Connect to the database
dbConnection();

// Error handling middleware
app.use(errormiddleWare);

// Route for uploading files

  
  

export default app;
