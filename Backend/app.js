import dotenv from "dotenv";
dotenv.config({ path: "./config/config.env" });

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { dbConnection } from "./database/dbConnection.js";
import userRouter from "./router/userRouter.js";
import { errormiddleWare } from "./middlewares/errorMiddeware.js";
import orderRouter from "./router/orderRouter.js";
import donationRoutes from "./router/donationRoutes.js";

const app = express();

app.use(cors({
  origin: [
    process.env.FRONTEND_URL,
    process.env.NGO_URL,
    process.env.VOLUNTEER_URL
  ],
  methods: ["GET", "POST", "DELETE", "PUT"],
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/order", orderRouter);
app.use("/api/v1/donation", donationRoutes);

// DB connection
dbConnection();

// SMTP startup check
console.log("[SMTP] Email configured:", !!process.env.SMTP_EMAIL, "→", process.env.SMTP_EMAIL || "NOT SET");

// Error middleware
app.use(errormiddleWare);

export default app;