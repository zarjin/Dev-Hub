import { Router } from "express";
import { login, register, logout } from "../controllers/auth.controller.ts";
import { authentication } from "../middlewares/authentication.middleware.ts";
import { validate } from "../middlewares/validate.middleware.ts";
import { loginSchema, registerSchema } from "../validators/auth.validator.ts";
export const authRouter = Router();

authRouter.post("/register", validate(registerSchema), register);
authRouter.post("/login", validate(loginSchema), login);
authRouter.post("/logout", authentication, logout);

export default authRouter;
