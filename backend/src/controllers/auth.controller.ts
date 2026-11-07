import type { Request, Response } from "express";

import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.utils";

import { comparePassword, hashingPassword } from "../utils/bcrypt.utils";

import { db } from "../prisma/db";

// ==========================================
// COOKIE CONFIGURATION
// ==========================================

const cookieOptions = {
  httpOnly: true,
  secure: process.env["NODE_ENV"] === "production",
  sameSite: "strict" as const,
  path: "/",
};

const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

// ==========================================
// REGISTER USER
// ==========================================

export const userRegister = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check existing email
    const existingEmail = await db.orm.public.User.where({
      email,
    });

    if (existingEmail?._row) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    // Check existing username
    const existingUsername = await db.orm.public.User.where({
      username,
    });

    if (existingUsername?._row) {
      return res.status(409).json({
        success: false,
        message: "Username already exists",
      });
    }

    // Hash password
    const hashedPassword = await hashingPassword(password);

    // Create user
    const user = await db.orm.public.User.create({
      username,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    console.error("Register Error:", error);

    return res.status(500).json({
      success: false,
      message: "User registration failed",
    });
  }
};

// ==========================================
// LOGIN USER
// ==========================================

export const userLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find user
    const existingUser = await db.orm.public.User.where({
      email,
    });

    if (!existingUser || !existingUser._row) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const user = existingUser._row;

    // Compare password
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // JWT payload
    const payload = {
      id: user.id,
      email: user.email,
      username: user.username,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Set access cookie
    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: COOKIE_MAX_AGE,
    });

    // Set refresh cookie
    res.cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: COOKIE_MAX_AGE,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      accessToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};

// ==========================================
// LOGOUT USER
// ==========================================

export const userLogout = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);

    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout Error:", error);

    res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
};

// ==========================================
// CHECK AUTH STATUS
// ==========================================

export const checkAuthStatus = async (_req: Request, res: Response) => {
  try {
    return res.status(200).json({
      success: true,
      authenticated: true,
    });
  } catch (error) {
    console.error("Auth Status Error:", error);

    return res.status(500).json({
      success: false,
      message: "Authentication status check failed",
    });
  }
};

// ==========================================
// REFRESH ACCESS TOKEN
// ==========================================

export const refreshToAccessTokenGenerate = async (
  req: Request,
  res: Response,
) => {
  try {
    const refreshToken = req.cookies?.["refreshToken"];

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token not found",
      });
    }

    const decoded = verifyRefreshToken(refreshToken);

    const accessToken = generateAccessToken(decoded as object);

    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: COOKIE_MAX_AGE,
    });

    return res.status(200).json({
      success: true,
      message: "Access token refreshed successfully",
      accessToken,
    });
  } catch (error) {
    console.error("Refresh Token Error:", error);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired refresh token",
    });
  }
};
