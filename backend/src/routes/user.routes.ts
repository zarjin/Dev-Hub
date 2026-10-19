import express from "express";
import {
  updateUser,
  deleteUser,
  getUserById,
  getAllUsers,
} from "../controllers/user.controller.ts";

const userRouter = express.Router();

userRouter.put("/users/:id", updateUser);
userRouter.delete("/users/:id", deleteUser);
userRouter.get("/users/:id", getUserById);
userRouter.get("/users", getAllUsers);

export default userRouter;
