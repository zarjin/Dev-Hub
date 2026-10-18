import express from "express";
import {
  updateUser,
  deleteUser,
  getUserById,
} from "../controllers/user.controller.ts";

const userRouter = express.Router();

userRouter.put("/users/:id", updateUser);
userRouter.delete("/users/:id", deleteUser);
userRouter.get("/users/:id", getUserById);

export default userRouter;
