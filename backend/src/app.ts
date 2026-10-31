import express from "express";
import type { Express } from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app: Express = express();

// CORS Configuration
app.use(
  cors({
    origin: process.env["CLIENT_URL"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie Parser
app.use(cookieParser());

// Health Check
app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is Running 🚀",
  });
});

export default app;
