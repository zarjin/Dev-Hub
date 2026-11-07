import express from "express";
import {
  userRegister,
  userLogin,
  userLogout,
  checkAuthStatus,
  refreshToAccessTokenGenerate,
} from "../controllers/auth.controller.js";
import { validate } from "../middleware/validation.middleware";
import {
  loginValidationSchema,
  registerValidationSchema,
} from "../validation/validation.schema.js";
import { authenticate } from "../middleware/auth.middleware";

const authRoute = express.Router();

authRoute.post("/register", validate(registerValidationSchema), userRegister);
authRoute.post("/login", validate(loginValidationSchema), userLogin);
authRoute.get("/check-auth", authenticate, checkAuthStatus);
authRoute.post("/logout", authenticate, userLogout);
authRoute.post("/accessToken", refreshToAccessTokenGenerate);

export default authRoute;
