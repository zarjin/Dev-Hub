import type { Request, Response } from "express";
import { StatusCodes, getReasonPhrase } from "http-status-codes";
import { hashPassword, verifyPassword } from "../utils/argon";
import {
  generateAccessToken,
  generateRefreshToken,
  TokenPayload,
  verifyRefreshToken,
} from "../utils/jwt";
import { prisma } from "../config/db";

export const userRegister = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: getReasonPhrase(status) });
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return res
        .status(StatusCodes.UNPROCESSABLE_ENTITY)
        .json({ message: getReasonPhrase(status) });
    }

    const hash = await hashPassword(password);

    const user = prisma.user.create({
      data: {
        username,
        email,
        password: hash,
      },
    });
    return res.status(StatusCodes.CREATED).json(user);
  } catch (error) {
    console.error(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: getReasonPhrase(status) });
  }
};

export const userLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: getReasonPhrase(status) });
    }
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!existingUser) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: getReasonPhrase(status) });
    }

    const verify = await verifyPassword(existingUser.password, password);

    if (!verify) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: getReasonPhrase(status) });
    }

    const payload: TokenPayload = {
      id: existingUser.id,
      email: existingUser.email,
      role: existingUser.role,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/api/v1/auth",
    });

    return res.status(StatusCodes.OK).json({ user: existingUser, accessToken });
  } catch (error) {
    console.error(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: getReasonPhrase(status) });
  }
};

export const userLogout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("refreshToken", {
      path: "/api/v1/auth",
    });
    return res
      .status(StatusCodes.OK)
      .json({ message: "Logged out successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: getReasonPhrase(status) });
  }
};

export const generateNewAccessToken = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: getReasonPhrase(status) });
    }
    const decoded = verifyRefreshToken(refreshToken) as TokenPayload;

    const accessToken = generateAccessToken(decoded);
    return res.status(StatusCodes.OK).json({ accessToken });
  } catch (error) {
    console.error(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: getReasonPhrase(status) });
  }
};
