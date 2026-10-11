import express from "express";
import { createServer } from "node:http";
import cookieParser from "cookie-parser";
import expressRateLimit from "express-rate-limit";
import cors from "cors";
import dotenv from "dotenv";

import { dbConnect } from "./config/db.config.ts";

dotenv.config();

dbConnect();

const app = express();
const server = createServer(app);

const limiter = expressRateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later",
});

app.use(limiter);
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req, res) => {
  res.send("Hello World!");
});

export { server };
