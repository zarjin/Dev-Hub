import { verifyAccessToken } from "../utils/jwt.utils";
import type { Request, Response, NextFunction } from "express";
import type { AuthUserPayload } from "../types/types";

declare global {
  namespace Express {
    interface Request {
      user?: AuthUserPayload;
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const bearerHeader = req.headers.authorization;

  const headerToken = bearerHeader?.startsWith("Bearer ")
    ? bearerHeader.split(" ")[1]
    : undefined;

  const cookieToken = req.cookies?.["accessToken"];

  const token = headerToken || cookieToken;

  if (!token) {
    res.status(401).json({
      success: false,
      message: "Access token is missing or unauthorized",
    });
    return;
  }

  try {
    const decoded = verifyAccessToken(token) as AuthUserPayload;
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({
      success: false,
      message: "Invalid or expired access token",
    });
  }
};
