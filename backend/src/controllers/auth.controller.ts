import type { Request, Response } from "express";
import { pool } from "../config/db.config.ts";
import { hashPassword, comparePassword } from "../utils/bcrypt.utils.ts";

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
    const { email, password } = req.body;
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (user.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    const isMatch = await comparePassword(password, user.rows[0].password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    res.status(200).json({ message: "Login successful", user: user.rows[0] });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const Users = async (req: Request, res: Response) => {
  try {
    const users = await pool.query("SELECT username, email FROM users");
    res.status(200).json({ users: users.rows });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
