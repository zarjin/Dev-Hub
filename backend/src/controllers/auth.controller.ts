import type { Request, Response } from "express";
import { pool } from "../config/db.config.ts";
import { hashPassword, comparePassword } from "../utils/bcrypt.utils.ts";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/jwt.utils.ts";

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await hashPassword(password);
    const newUser = await pool.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING username, email",
      [username, email, hashedPassword],
    );
    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser.rows[0] });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    console.log("[auth.login] Login request received");
    const { email, password } = req.body;
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (user.rows.length === 0) {
      console.log("[auth.login] User was not found");
      return res.status(404).json({ message: "User not found" });
    }
    console.log("[auth.login] User found");

    const isMatch = await comparePassword(password, user.rows[0].password);
    if (!isMatch) {
      console.log("[auth.login] Password verification failed");
      return res.status(401).json({ message: "Invalid credentials" });
    }
    console.log("[auth.login] Password verification succeeded");

    const payload = {
      id: String(user.rows[0].id),
      email: user.rows[0].email,
    };
    const accessSecret = process.env.ACCESS_TOKEN_SECRET;
    const refreshSecret = process.env.REFRESH_TOKEN_SECRET;

    console.log("[auth.login] JWT secret configuration", {
      accessSecretConfigured: Boolean(accessSecret),
      refreshSecretConfigured: Boolean(refreshSecret),
    });

    if (!accessSecret || !refreshSecret) {
      console.error("[auth.login] Required JWT secret is not configured");
      return res.status(500).json({ message: "JWT secret is not configured" });
    }

    const accessToken = generateAccessToken(payload, accessSecret);
    const refreshToken = generateRefreshToken(payload, refreshSecret);
    console.log("[auth.login] Access and refresh tokens generated");

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      message: "Login successful",
      user: user.rows[0],
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("[auth.login] Login failed", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
    });

    return res.status(200).json({
      message: "Logout successful",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
