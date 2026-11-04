import {
  generateAccessToken,
  generateRefreshToken,
} from "./../utils/jwt.utils";
import type { Request, Response } from "express";
import { db } from "../prisma/db";
import { comparePassword, hashingPassword } from "../utils/bcrypt.utils";

export const userRegister = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    const exstingUser = await db.orm.public.User.where({
      email,
      username,
    });

    if (exstingUser) {
      console.log("user all ready exsting");
      return res.status(409).json({
        message: "user is already exsting",
      });
    }

    const hashPassword = await hashingPassword(password);

    const user = await db.orm.public.User.create({
      username,
      email,
      password: hashPassword,
    });

    return res.status(200).json({ message: "user created succesfully", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "user create unsuccessfuly" });
  }
};

export const userLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const exstingUser = await db.orm.public.User.where({
      email,
    });

    const match = await comparePassword(
      password,
      exstingUser._row?.password as string,
    );

    if (!match) {
      res.status(500).json({ message: "invaild Password" });
    }

    const payload = {
      id: exstingUser._row?.id,
      email: exstingUser._row?.email,
      username: exstingUser._row?.username,
    };
    if (!exstingUser) {
      return res.status(404).json({ message: "user is not found" });
    }

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env["NODE_ENV"] === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
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
      message: "Login successful",
    });
  } catch (error) {}
};

export const userLogout = async (req: Request, res: Response) => {
  try {
  } catch (error) {}
};

export const checkAuthStatus = async (req: Request, res: Response) => {
  try {
  } catch (error) {}
};

export const refreshToAccessTokenGenerate = async (
  req: Request,
  res: Response,
) => {
  try {
  } catch (error) {}
};
