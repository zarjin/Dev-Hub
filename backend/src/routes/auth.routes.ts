import express from "express";
import {
  userRegister,
  userLogin,
  userLogout,
  generateNewAccessToken,
  checkAuthStatus,
} from "../controllers/auth.controller";
import { validate } from "../middlewares/validate.middleware";
import { registerSchema, loginSchema } from "../schemas/auth.schema";

const authRoute = express.Router();

authRoute.post("/register", validate(registerSchema), userRegister);
authRoute.post("/login", validate(loginSchema), userLogin);
authRoute.post("/logout", userLogout);
authRoute.get("/refresh-token", generateNewAccessToken);
authRoute.get("/check-auth", checkAuthStatus);

export default authRoute;
