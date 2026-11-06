import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "./../utils/jwt.utils";
import type { Request, Response } from "express";
import { db } from "../prisma/db";
import { comparePassword, hashingPassword } from "../utils/bcrypt.utils";

export const userRegister = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await db.orm.public.User.where({
      email,
      username,
    });

    if (existingUser) {
      console.log("user all ready existing");
      return res.status(409).json({
        message: "user is already existing",
      });
    }

    const hashPassword = await hashingPassword(password);

    const user = await db.orm.public.User.create({
      username,
      email,
      password: hashPassword,
    });

    return res.status(200).json({ message: "user created successfully", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "user create unsuccessfully" });
  }
};

export const userLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const existingUser = await db.orm.public.User.where({
      email,
    });

    const match = await comparePassword(
      password,
      existingUser._row?.password as string,
    );

    if (!match) {
      res.status(500).json({ message: "invalid Password" });
    }

    const payload = {
      id: existingUser._row?.id,
      email: existingUser._row?.email,
      username: existingUser._row?.username,
    };
    if (!existingUser) {
      return res.status(404).json({ message: "user is not found" });
    }

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env["NODE_ENV"] === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env["NODE_ENV"] === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    return res.status(200).json({
      success: true,
      accessToken: accessToken,
      message: "Login successful",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "user login error" });
  }
};

export const userLogout = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env["NODE_ENV"] === "production",
      sameSite: "strict",
    });

    res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);

    res.status(500).json({
      success: false,
      message: "User logout error",
    });
  }
};
export const checkAuthStatus = async (req: Request, res: Response) => {
  try {
    return res.status(200).json({ authaction: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "user is authactions" });
  }
};

export const refreshToAccessTokenGenerate = async (
  req: Request,
  res: Response,
) => {
  try {
    const token = req.cookies["refreshToken"];

    const decode = verifyRefreshToken(token);

    const accessToken = generateAccessToken(decode as object);

    res.status(200).json({ accessToken });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "generate access token error" });
  }
};
