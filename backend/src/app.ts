import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import compression from "compression";
import expressRateLimit from "express-rate-limit";

dotenv.config();
import authRoute from "./routes/auth.routes";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
  }),
);
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(compression());
app.use(expressRateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use("/auth/api/v1", authRoute);

export default app;
