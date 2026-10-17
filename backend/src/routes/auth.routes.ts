import { Router } from "express";
import { login, register, Users } from "../controllers/auth.controller.ts";

export const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/users", Users);

export default authRouter;
