import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.utils.ts";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role?: string;
      };
    }
  }
}

export const authentication = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res
        .status(401)
        .json({ message: "Authentication token missing or invalid" });
      return;
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Authentication token is required",
      });
      return;
    }

    const decoded = verifyToken(token, process.env.JWT_TOKEN as string);

    if (
      !decoded ||
      typeof decoded === "string" ||
      !("id" in decoded) ||
      !("email" in decoded) ||
      typeof decoded.id !== "string" ||
      typeof decoded.email !== "string"
    ) {
      res.status(401).json({
        success: false,
        message: "Invalid authentication token",
      });
      return;
    }

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role:
        "role" in decoded && typeof decoded.role === "string"
          ? decoded.role
          : undefined,
    };

    next();
  } catch {
    res.status(401).json({
      success: false,
      message: "Invalid or expired authentication token",
    });
  }
};
